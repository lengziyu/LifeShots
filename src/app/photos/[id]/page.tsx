import { notFound } from "next/navigation";
import Image from "next/image";

import { AppShell } from "@/components/app-shell";
import { PhotoDetailEditor } from "@/components/photo-detail-editor";
import { photoWithTagsInclude, serializePhoto } from "@/lib/photos";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PhotoDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;

  const photo = await prisma.photo.findUnique({
    where: { id, userId: user.id },
    include: photoWithTagsInclude,
  });

  if (!photo) {
    notFound();
  }

  const serialized = serializePhoto(photo);

  return (
    <AppShell title="照片详情" backHref="/">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/50 bg-white shadow-sm">
        <Image
          src={serialized.imageUrl}
          alt={serialized.caption ?? "photo detail"}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
      <PhotoDetailEditor photo={serialized} />
    </AppShell>
  );
}
