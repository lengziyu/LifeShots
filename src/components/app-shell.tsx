import Link from "next/link";

import { BottomNav } from "@/components/bottom-nav";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
};

export function AppShell({ title, subtitle, children, actionHref, actionLabel }: AppShellProps) {
  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pt-4 pb-6">
        <header className="mb-4 rounded-3xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
            </div>
            {actionHref && actionLabel ? (
              <Link
                href={actionHref}
                className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-foreground)] shadow-sm"
              >
                {actionLabel}
              </Link>
            ) : null}
          </div>
        </header>
        <div className="space-y-4">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
