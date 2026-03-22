"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { clearPendingUpload, pendingUploadToFile, readPendingUpload } from "@/lib/pending-upload";
import type { Category } from "@/types/photo";

const options: Array<{ value: Category; label: string }> = [
  { value: "CAT", label: "小猫" },
  { value: "CAR", label: "汽车" },
  { value: "DAILY", label: "日常" },
];

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fromQuickCapture, setFromQuickCapture] = useState(false);
  const [category, setCategory] = useState<Category>("DAILY");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const quickSignal = searchParams.get("quick");

  useEffect(() => {
    let disposed = false;
    const pending = readPendingUpload();
    if (!pending) return;

    // Older than 15min => drop it.
    if (Date.now() - pending.createdAt > 15 * 60 * 1000) {
      clearPendingUpload();
      return;
    }

    pendingUploadToFile(pending)
      .then((pendingFile) => {
        if (disposed) return;
        setFile(pendingFile);
        setPreviewUrl(pending.dataUrl);
        setFromQuickCapture(true);
      })
      .catch(() => {
        clearPendingUpload();
      });

    return () => {
      disposed = true;
    };
  }, [quickSignal]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFilePicked(nextFile: File | null) {
    setFile(nextFile);
    setFromQuickCapture(false);
    clearPendingUpload();

    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      if (!nextFile) {
        return null;
      }
      return URL.createObjectURL(nextFile);
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("请先选择一张图片");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("category", category);
      formData.set("caption", caption);
      formData.set("tags", tags);
      formData.set("takenAt", takenAt);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; photo?: { id: string } };
      if (!response.ok || !data.photo) {
        setError(data.error ?? "上传失败");
        return;
      }

      clearPendingUpload();
      router.replace(`/photos/${data.photo.id}`);
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/50 bg-white p-4 shadow-sm">
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">照片</p>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleFilePicked(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--accent-soft-foreground)]"
        />
        {fromQuickCapture ? <p className="mt-2 text-xs text-slate-500">已从右下角拍照快捷入口带入图片</p> : null}
        {previewUrl ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image
              src={previewUrl}
              alt="upload preview"
              width={1200}
              height={700}
              unoptimized
              className="h-44 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">分类</p>
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
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">拍摄时间</p>
        <input
          type="datetime-local"
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">描述</p>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="记录一下这张照片的故事"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">标签</p>
        <input
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="睡觉, 玩耍, 洗车"
        />
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        disabled={loading}
        className="h-12 w-full rounded-2xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-foreground)]"
      >
        {loading ? "上传中..." : "上传照片"}
      </button>
    </form>
  );
}
