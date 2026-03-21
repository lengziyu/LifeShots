import { NextResponse } from "next/server";

import { hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (exists) {
      return NextResponse.json({ error: "这个邮箱已被注册" }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        displayName: parsed.data.displayName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    await setSessionCookie(user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
