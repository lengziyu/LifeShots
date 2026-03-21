"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "时间线",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/upload",
    label: "上传",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 16V8m0 0-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="4" y="16" width="16" height="4" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/categories",
    label: "分类",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/favorites",
    label: "收藏",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M12 20c-4.5-3.2-7-5.4-7-8.2A3.8 3.8 0 0 1 8.8 8c1.3 0 2.4.6 3.2 1.7A4 4 0 0 1 15.2 8a3.8 3.8 0 0 1 3.8 3.8c0 2.8-2.5 5-7 8.2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "设置",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19 12 .9 1.5-1.5 2.6-1.7-.2a6.8 6.8 0 0 1-1.2.7L14.9 19h-3.8l-.6-1.4a6.8 6.8 0 0 1-1.2-.7l-1.7.2-1.5-2.6L5 12l.9-1.5-1-1.5 1.5-2.6 1.7.2c.4-.3.8-.5 1.2-.7l.6-1.4h3.8l.6 1.4c.4.2.8.4 1.2.7l1.7-.2L20 9l-1 1.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-[var(--nav-border)] bg-white/92 px-2 py-2 backdrop-blur-sm">
      <ul className="mx-auto grid w-full max-w-xl grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  "flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold transition",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] ring-1 ring-[var(--accent-soft-border)]"
                    : "text-slate-500 hover:bg-[var(--nav-hover)] hover:text-slate-700",
                )}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
