import { AppShell } from "@/components/app-shell";
import { PhotoCard } from "@/components/photo-card";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

function formatTimelineDate(iso: string | null) {
  const value = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(value);
}

export default async function TimelinePage() {
  const user = await requireUser();

  const photos = await prisma.photo.findMany({
    where: { userId: user.id },
    include: photoWithTagsInclude,
    orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  const items = photos.map(serializePhoto);

  return (
    <AppShell title={`${user.displayName} 的图集`} subtitle="按时间浏览你的照片">
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
