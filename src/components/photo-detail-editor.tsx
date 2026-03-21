"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { PhotoItem, Category } from "@/types/photo";

const options: Array<{ value: Category; label: string }> = [
  { value: "CAT", label: "小猫" },
  { value: "CAR", label: "汽车" },
  { value: "DAILY", label: "日常" },
];

type Props = {
  photo: PhotoItem;
};

function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

export function PhotoDetailEditor({ photo }: Props) {
  const router = useRouter();

  const [caption, setCaption] = useState(photo.caption ?? "");
  const [category, setCategory] = useState<Category>(photo.category);
  const [tags, setTags] = useState(photo.tags.join(", "));
  const [takenAt, setTakenAt] = useState(toDatetimeLocal(photo.takenAt));
  const [isFavorite, setIsFavorite] = useState(photo.isFavorite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          category,
          tags,
          takenAt: takenAt || null,
          isFavorite,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "保存失败");
        return;
      }

      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm("确认删除这张照片吗？");
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "删除失败");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/50 bg-white p-4 shadow-sm">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">分类</span>
        <select
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">拍摄时间</span>
        <input
          type="datetime-local"
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">描述</span>
        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          className="min-h-24 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">标签</span>
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          placeholder="睡觉, 玩耍"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(event) => setIsFavorite(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        收藏这张照片
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={loading}
          onClick={save}
          className="h-11 rounded-2xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-foreground)]"
        >
          保存
        </button>
        <button
          disabled={loading}
          onClick={remove}
          className="h-11 rounded-2xl bg-rose-100 text-sm font-semibold text-rose-700"
        >
          删除
        </button>
      </div>
    </div>
  );
}
