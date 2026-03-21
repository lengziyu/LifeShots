import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contentTypeFromFilename, readStoredFile } from "@/lib/storage";

type Context = {
  params: Promise<{
    kind: string;
    filename: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { kind, filename } = await context.params;
  if (kind !== "upload" && kind !== "thumb") {
    return NextResponse.json({ error: "类型不支持" }, { status: 400 });
  }

  const candidatePath = `/api/files/${kind}/${filename}`;
  const where =
    kind === "upload"
      ? { userId: user.id, imageUrl: candidatePath }
      : { userId: user.id, thumbUrl: candidatePath };

  const exists = await prisma.photo.findFirst({
    where,
    select: { id: true },
  });

  if (!exists) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const file = await readStoredFile(kind, filename);
  if (!file) {
    return NextResponse.json({ error: "文件不存在" }, { status: 404 });
  }

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFromFilename(filename),
      "Cache-Control": "private, max-age=86400",
    },
  });
}
