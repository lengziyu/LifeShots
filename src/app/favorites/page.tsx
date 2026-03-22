import { AppShell } from "@/components/app-shell";
import { PhotoCard } from "@/components/photo-card";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export default async function FavoritesPage() {
  const user = await requireUser();

  const photos = await prisma.photo.findMany({
    where: {
      userId: user.id,
      isFavorite: true,
    },
    include: photoWithTagsInclude,
    orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AppShell title="我的收藏" backHref="/me">
      {!photos.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          还没有收藏照片。
        </div>
      ) : (
        <div className="space-y-3">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={serializePhoto(photo)} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
