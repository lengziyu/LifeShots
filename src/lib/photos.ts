import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/validators";

export const photoWithTagsInclude = {
  photoTags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PhotoInclude;

export function serializePhoto(photo: Prisma.PhotoGetPayload<{ include: typeof photoWithTagsInclude }>) {
  return {
    id: photo.id,
    userId: photo.userId,
    category: photo.category,
    imageUrl: photo.imageUrl,
    thumbUrl: photo.thumbUrl,
    caption: photo.caption,
    takenAt: photo.takenAt?.toISOString() ?? null,
    createdAt: photo.createdAt.toISOString(),
    isFavorite: photo.isFavorite,
    tags: photo.photoTags.map((item) => item.tag.name),
  };
}

export async function updatePhotoTags(photoId: string, userId: string, rawTags: string | string[] | null | undefined) {
  const tags = parseTags(rawTags);

  await prisma.photoTag.deleteMany({ where: { photoId } });

  if (!tags.length) {
    return;
  }

  await prisma.photo.update({
    where: { id: photoId, userId },
    data: {
      photoTags: {
        create: tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: {
                userId_name: {
                  userId,
                  name,
                },
              },
              create: {
                userId,
                name,
              },
            },
          },
        })),
      },
    },
  });
}
