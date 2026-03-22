import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PhotoCard } from "@/components/photo-card";
import { parseCategory, categoryLabel } from "@/lib/categories";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryDetailPage({ params }: Props) {
  const user = await requireUser();
  const { category } = await params;

  const normalized = category.toUpperCase();
  if (!["CAT", "CAR", "DAILY"].includes(normalized)) {
    notFound();
  }

  const parsedCategory = parseCategory(normalized);

  const photos = await prisma.photo.findMany({
    where: {
      userId: user.id,
      category: parsedCategory,
    },
    include: photoWithTagsInclude,
    orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AppShell title={categoryLabel(parsedCategory)} backHref="/categories">
      {!photos.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          该分类还没有照片。
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
