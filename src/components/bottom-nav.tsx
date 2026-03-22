"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

function AlbumIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.9">
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="m8 14 2.4-2.5a1.4 1.4 0 0 1 2.1.1l3.5 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 18c1.5-2.7 3.7-4 6-4s4.5 1.3 6 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 9.5a2 2 0 0 1 2-2h2.1l1-1.8A1.6 1.6 0 0 1 10.5 5h3a1.6 1.6 0 0 1 1.4.7l1 1.8H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9.5Z" />
      <circle cx="12" cy="13" r="3.3" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const albumActive = pathname === "/" || pathname.startsWith("/photos/");
  const uploadActive = pathname.startsWith("/upload");
  const meActive = ["/me", "/settings", "/favorites", "/categories"].some((item) => pathname.startsWith(item));

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+2px)]">
      <div className="mx-auto w-full max-w-xl rounded-t-3xl border border-[var(--nav-border)] bg-white/96 px-6 pt-1 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="grid grid-cols-3 items-end">
          <Link
            href="/"
            className={clsx(
              "flex h-13 items-center justify-center rounded-2xl transition",
              albumActive
                ? "text-[var(--accent-soft-foreground)]"
                : "text-slate-500 hover:bg-[var(--nav-hover)] hover:text-slate-700",
            )}
          >
            <AlbumIcon />
          </Link>

          <Link
            href="/upload"
            aria-label="上传照片"
            className={clsx(
              "mx-auto -mt-[26px] flex h-[74px] w-[74px] items-center justify-center rounded-full border-4 border-white bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_12px_22px_rgba(15,23,42,0.22)]",
              uploadActive ? "ring-2 ring-[var(--accent-soft-border)]" : "",
            )}
          >
            <CameraIcon />
          </Link>

          <Link
            href="/me"
            className={clsx(
              "flex h-13 items-center justify-center rounded-2xl transition",
              meActive ? "text-[var(--accent-soft-foreground)]" : "text-slate-500 hover:bg-[var(--nav-hover)] hover:text-slate-700",
            )}
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}
