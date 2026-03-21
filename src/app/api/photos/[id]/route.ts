import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { parseCategory } from "@/lib/categories";
import { photoWithTagsInclude, serializePhoto, updatePhotoTags } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { removeStoredFileByUrl } from "@/lib/storage";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await context.params;
  const photo = await prisma.photo.findUnique({
    where: { id, userId: user.id },
    include: photoWithTagsInclude,
  });

  if (!photo) {
    return NextResponse.json({ error: "照片不存在" }, { status: 404 });
  }

  return NextResponse.json({ photo: serializePhoto(photo) });
}

export async function PATCH(request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.photo.findUnique({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "照片不存在" }, { status: 404 });
    }

    const data: {
      caption?: string | null;
      category?: "CAT" | "CAR" | "DAILY";
      takenAt?: Date | null;
      isFavorite?: boolean;
    } = {};

    if (typeof body.caption === "string") {
      data.caption = body.caption.trim().slice(0, 500) || null;
    }

    if (typeof body.category === "string") {
      data.category = parseCategory(body.category);
    }

    if (typeof body.isFavorite === "boolean") {
      data.isFavorite = body.isFavorite;
    }

    if (Object.prototype.hasOwnProperty.call(body, "takenAt")) {
      if (!body.takenAt) {
        data.takenAt = null;
      } else {
        const parsedDate = new Date(String(body.takenAt));
        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json({ error: "拍摄时间格式不正确" }, { status: 400 });
        }
        data.takenAt = parsedDate;
      }
    }

    if (Object.keys(data).length > 0) {
      await prisma.photo.update({
        where: { id, userId: user.id },
        data,
      });
    }

    if (Object.prototype.hasOwnProperty.call(body, "tags")) {
      await updatePhotoTags(id, user.id, body.tags);
    }

    const updated = await prisma.photo.findUnique({
      where: { id, userId: user.id },
      include: photoWithTagsInclude,
    });

    if (!updated) {
      return NextResponse.json({ error: "更新失败" }, { status: 500 });
    }

    return NextResponse.json({ photo: serializePhoto(updated) });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await context.params;
  const photo = await prisma.photo.findUnique({
    where: { id, userId: user.id },
    select: {
      id: true,
      imageUrl: true,
      thumbUrl: true,
    },
  });

  if (!photo) {
    return NextResponse.json({ error: "照片不存在" }, { status: 404 });
  }

  await prisma.photo.delete({ where: { id, userId: user.id } });
  await Promise.all([removeStoredFileByUrl(photo.imageUrl), removeStoredFileByUrl(photo.thumbUrl)]);

  return NextResponse.json({ ok: true });
}
