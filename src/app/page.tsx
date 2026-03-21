import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PhotoCard } from "@/components/photo-card";
import { parseCategory, CATEGORY_OPTIONS } from "@/lib/categories";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

function formatTimelineDate(iso: string | null) {
  const value = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(value);
}

export default async function TimelinePage({ searchParams }: Props) {
  const user = await requireUser();
  const query = await searchParams;

  const activeCategory = query.category ? parseCategory(query.category) : null;
  const where = {
    userId: user.id,
    ...(activeCategory ? { category: activeCategory } : {}),
  };

  const photos = await prisma.photo.findMany({
    where,
    include: photoWithTagsInclude,
    orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  const items = photos.map(serializePhoto);

  return (
    <AppShell
      title={`${user.displayName} 的时间线`}
      subtitle="按时间记录你和生活"
      actionHref="/upload"
      actionLabel="上传"
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/"
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
            !activeCategory ? "bg-slate-900 text-white" : "bg-white text-slate-500"
          }`}
        >
          全部
        </Link>
        {CATEGORY_OPTIONS.map((item) => (
          <Link
            key={item.value}
            href={`/?category=${item.value}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
              activeCategory === item.value ? "bg-slate-900 text-white" : "bg-white text-slate-500"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {!items.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          暂无照片，去上传第一张吧。
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((photo, index) => {
            const prev = items[index - 1];
            const currentDate = formatTimelineDate(photo.takenAt ?? photo.createdAt);
            const prevDate = prev ? formatTimelineDate(prev.takenAt ?? prev.createdAt) : null;
            const showDate = currentDate !== prevDate;

            return (
              <section key={photo.id} className="space-y-2">
                {showDate ? <h2 className="px-1 text-xs font-semibold text-slate-500">{currentDate}</h2> : null}
                <PhotoCard photo={photo} />
              </section>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
