import Link from "next/link";
import Image from "next/image";

import { categoryLabel } from "@/lib/categories";
import type { PhotoItem } from "@/types/photo";

function formatDate(input: string | null) {
  const date = input ? new Date(input) : null;
  const target = date && !Number.isNaN(date.getTime()) ? date : new Date();
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(target);
}

type PhotoCardProps = {
  photo: PhotoItem;
};

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link href={`/photos/${photo.id}`} className="block rounded-3xl border border-white/40 bg-white p-2 shadow-sm">
      <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={photo.thumbUrl || photo.imageUrl}
          alt={photo.caption ?? "photo"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="px-1 pt-3 pb-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">{categoryLabel(photo.category)}</p>
          <p className="text-xs text-slate-400">{formatDate(photo.takenAt ?? photo.createdAt)}</p>
        </div>
        <p className="line-clamp-2 text-sm text-slate-700">{photo.caption || "这张照片还没有描述"}</p>
        {photo.tags.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {photo.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
