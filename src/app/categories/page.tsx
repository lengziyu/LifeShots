import Link from "next/link";
import Image from "next/image";

import { AppShell } from "@/components/app-shell";
import { CATEGORY_OPTIONS, categoryLabel } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export default async function CategoriesPage() {
  const user = await requireUser();

  const [counts, latest] = await Promise.all([
    prisma.photo.groupBy({
      by: ["category"],
      where: { userId: user.id },
      _count: {
        _all: true,
      },
    }),
    prisma.photo.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        category: true,
        thumbUrl: true,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const countMap = new Map(counts.map((item) => [item.category, item._count._all]));
  const latestMap = new Map(latest.map((item) => [item.category, item]));

  return (
    <AppShell title="分类浏览" subtitle="按主题快速回看照片">
      <div className="grid grid-cols-1 gap-3">
        {CATEGORY_OPTIONS.map((item) => {
          const cover = latestMap.get(item.value);
          const count = countMap.get(item.value) ?? 0;

          return (
            <Link
              key={item.value}
              href={`/categories/${item.value.toLowerCase()}`}
              className="flex items-center gap-3 rounded-3xl border border-white/50 bg-white p-3 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                {cover ? (
                  <Image
                    src={cover.thumbUrl}
                    alt={categoryLabel(item.value)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{count} 张照片</p>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
