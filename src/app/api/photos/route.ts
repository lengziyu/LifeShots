import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { parseCategory } from "@/lib/categories";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/validators";
import { saveImageAndThumb } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const favoriteParam = searchParams.get("favorite");
  const tagParam = searchParams.get("tag");
  const monthParam = searchParams.get("month");
  const limit = Math.min(Number(searchParams.get("limit") ?? 60), 120);

  const where: Prisma.PhotoWhereInput = {
    userId: user.id,
  };

  if (categoryParam) {
    where.category = parseCategory(categoryParam);
  }

  if (favoriteParam === "1") {
    where.isFavorite = true;
  }

  if (tagParam) {
    where.photoTags = {
      some: {
        tag: {
          name: tagParam,
        },
      },
    };
  }

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    where.createdAt = {
      gte: start,
      lt: end,
    };
  }

  const photos = await prisma.photo.findMany({
    where,
    include: photoWithTagsInclude,
    orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return NextResponse.json({
    photos: photos.map(serializePhoto),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "请选择图片" }, { status: 400 });
    }

    const category = parseCategory(String(formData.get("category") ?? "DAILY"));
    const caption = String(formData.get("caption") ?? "").trim().slice(0, 500);
    const tags = parseTags(String(formData.get("tags") ?? ""));

    const takenAtRaw = String(formData.get("takenAt") ?? "").trim();
    const takenAt = takenAtRaw ? new Date(takenAtRaw) : null;

    if (takenAtRaw && Number.isNaN(takenAt?.getTime())) {
      return NextResponse.json({ error: "拍摄时间格式不正确" }, { status: 400 });
    }

    const uploaded = await saveImageAndThumb(file);

    const photo = await prisma.photo.create({
      data: {
        userId: user.id,
        category,
        imageUrl: uploaded.imageUrl,
        thumbUrl: uploaded.thumbUrl,
        caption: caption || null,
        takenAt,
        photoTags: {
          create: tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: {
                  userId_name: {
                    userId: user.id,
                    name,
                  },
                },
                create: {
                  userId: user.id,
                  name,
                },
              },
            },
          })),
        },
      },
      include: photoWithTagsInclude,
    });

    return NextResponse.json({ photo: serializePhoto(photo) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
