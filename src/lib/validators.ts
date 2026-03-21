import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("请输入正确邮箱").toLowerCase(),
  password: z.string().min(6, "密码至少 6 位"),
});

export const registerSchema = z.object({
  displayName: z.string().trim().min(2, "昵称至少 2 个字符").max(32, "昵称过长"),
  email: z.email("请输入正确邮箱").toLowerCase(),
  password: z.string().min(8, "密码至少 8 位"),
});

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2, "昵称至少 2 个字符").max(32, "昵称过长"),
});

export function parseTags(input?: string | string[] | null): string[] {
  const source = Array.isArray(input) ? input.join(",") : input ?? "";

  return source
    .split(",")
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .filter((value, idx, arr) => arr.indexOf(value) === idx)
    .slice(0, 20);
}
