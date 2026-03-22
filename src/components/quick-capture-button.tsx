"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { fileToDataUrl, savePendingUpload } from "@/lib/pending-upload";

export function QuickCaptureButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setBusy(true);
      const dataUrl = await fileToDataUrl(file);
      savePendingUpload({
        dataUrl,
        fileName: file.name || `capture-${Date.now()}.jpg`,
        mimeType: file.type || "image/jpeg",
        createdAt: Date.now(),
      });
      router.push(`/upload?quick=${Date.now()}`);
    } catch {
      // ignore and let user retry
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        aria-label="拍照上传"
        onClick={() => inputRef.current?.click()}
        className="fixed right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_10px_22px_rgba(15,23,42,0.22)] transition active:scale-95"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 94px)" }}
      >
        {busy ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="2">
            <path d="M4 9.5a2 2 0 0 1 2-2h2.1l1-1.8A1.6 1.6 0 0 1 10.5 5h3a1.6 1.6 0 0 1 1.4.7l1 1.8H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9.5Z" />
            <circle cx="12" cy="13" r="3.1" />
            <path d="M19 5v3M17.5 6.5h3" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}
