import type { Category } from "@prisma/client";

export const CATEGORY_OPTIONS: Array<{ value: Category; label: string }> = [
  { value: "CAT", label: "小猫" },
  { value: "CAR", label: "汽车" },
  { value: "DAILY", label: "日常" },
];

export function parseCategory(value?: string | null): Category {
  const raw = (value ?? "").toUpperCase();
  if (raw === "CAT" || raw === "CAR" || raw === "DAILY") {
    return raw;
  }
  return "DAILY";
}

export function categoryLabel(value: Category): string {
  return CATEGORY_OPTIONS.find((item) => item.value === value)?.label ?? value;
}
