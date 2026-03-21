import { NextResponse } from "next/server";

import { comparePassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }

    const isValid = await comparePassword(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }

    await setSessionCookie(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch {
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
