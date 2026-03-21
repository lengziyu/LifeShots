"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "时间线" },
  { href: "/upload", label: "上传" },
  { href: "/categories", label: "分类" },
  { href: "/favorites", label: "收藏" },
  { href: "/settings", label: "设置" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-white/50 bg-white/90 px-2 py-2 backdrop-blur-sm">
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
                  "flex h-11 items-center justify-center rounded-2xl text-xs font-semibold transition",
                  active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
