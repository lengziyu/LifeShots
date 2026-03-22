"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

function AlbumIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" stroke="currentColor" strokeWidth="1.9">
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="m8 14 2.4-2.5a1.4 1.4 0 0 1 2.1.1l3.5 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 18c1.5-2.7 3.7-4 6-4s4.5 1.3 6 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="2.1">
      <path d="M12 16V7.8M8.8 11 12 7.8 15.2 11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 16.4A2.2 2.2 0 0 0 7.4 18h9.2a2.2 2.2 0 0 0 2.2-1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9.2" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const albumActive = pathname === "/" || pathname.startsWith("/photos/");
  const uploadActive = pathname.startsWith("/upload");
  const meActive = ["/me", "/settings", "/favorites", "/categories"].some((item) => pathname.startsWith(item));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto w-full max-w-xl px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-3 items-end rounded-t-[30px] border border-[var(--nav-border)] bg-white/96 px-5 pt-1.5 pb-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <Link
            href="/"
            aria-current={albumActive ? "page" : undefined}
            className={clsx(
              "relative flex h-14 items-center justify-center rounded-2xl transition",
              albumActive
                ? "bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] ring-1 ring-[var(--accent-soft-border)]"
                : "text-[color-mix(in_oklab,var(--accent-soft-foreground)_75%,var(--text-main))] hover:bg-[var(--nav-hover)]",
            )}
          >
            <AlbumIcon />
            {albumActive ? <span className="absolute bottom-1.5 h-1.5 w-5 rounded-full bg-[var(--accent-soft-foreground)]" /> : null}
          </Link>

          <Link
            href="/upload"
            aria-label="上传照片"
            className={clsx(
              "mx-auto -mt-[34px] flex h-[82px] w-[82px] items-center justify-center rounded-full border-4 border-white bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_12px_24px_rgba(15,23,42,0.22)] transition active:scale-95",
              uploadActive ? "ring-2 ring-[var(--accent-soft-border)]" : "brightness-95",
            )}
          >
            <UploadIcon />
          </Link>

          <Link
            href="/me"
            aria-current={meActive ? "page" : undefined}
            className={clsx(
              "relative flex h-14 items-center justify-center rounded-2xl transition",
              meActive
                ? "bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] ring-1 ring-[var(--accent-soft-border)]"
                : "text-[color-mix(in_oklab,var(--accent-soft-foreground)_75%,var(--text-main))] hover:bg-[var(--nav-hover)]",
            )}
          >
            <UserIcon />
            {meActive ? <span className="absolute bottom-1.5 h-1.5 w-5 rounded-full bg-[var(--accent-soft-foreground)]" /> : null}
          </Link>
        </div>
      </div>
    </nav>
  );
}
