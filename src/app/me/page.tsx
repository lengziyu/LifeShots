import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export default async function MePage() {
  const user = await requireUser();

  const [photoCount, favoriteCount] = await Promise.all([
    prisma.photo.count({ where: { userId: user.id } }),
    prisma.photo.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return (
    <AppShell title="我的" subtitle="管理内容与偏好">
      <section className="rounded-3xl border border-white/60 bg-white p-4 shadow-sm">
        <p className="text-base font-semibold text-slate-900">{user.displayName}</p>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-slate-50 py-2">
            <p className="text-lg font-bold text-slate-800">{photoCount}</p>
            <p className="text-xs text-slate-500">照片总数</p>
          </div>
          <div className="rounded-2xl bg-slate-50 py-2">
            <p className="text-lg font-bold text-slate-800">{favoriteCount}</p>
            <p className="text-xs text-slate-500">我的收藏</p>
          </div>
        </div>
      </section>

      <section className="space-y-2 rounded-3xl border border-white/60 bg-white p-3 shadow-sm">
        <Link href="/favorites" className="flex h-12 items-center justify-between rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700">
          <span>我的收藏</span>
          <span aria-hidden>›</span>
        </Link>
        <Link href="/categories" className="flex h-12 items-center justify-between rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700">
          <span>分类管理</span>
          <span aria-hidden>›</span>
        </Link>
        <Link href="/settings" className="flex h-12 items-center justify-between rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700">
          <span>设置</span>
          <span aria-hidden>›</span>
        </Link>
      </section>
    </AppShell>
  );
}
