export type Category = "CAT" | "CAR" | "DAILY";

export type PhotoItem = {
  id: string;
  userId: string;
  category: Category;
  imageUrl: string;
  thumbUrl: string;
  caption: string | null;
  takenAt: string | null;
  createdAt: string;
  isFavorite: boolean;
  tags: string[];
};
