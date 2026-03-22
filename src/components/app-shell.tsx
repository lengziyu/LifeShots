import Link from "next/link";

import { BottomNav } from "@/components/bottom-nav";
import { QuickCaptureButton } from "@/components/quick-capture-button";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  backHref?: string;
};

export function AppShell({ title, subtitle, children, actionHref, actionLabel, backHref }: AppShellProps) {
  return (
    <div className="min-h-dvh pb-[calc(env(safe-area-inset-bottom)+44px)]">
      <main className="mx-auto flex w-full max-w-xl flex-col px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-3">
        {backHref ? (
          <header className="mb-3 rounded-2xl border border-white/60 bg-white/82 px-2 py-1.5 shadow-sm backdrop-blur-sm">
            <div className="grid grid-cols-[40px_1fr_40px] items-center">
              <Link href={backHref} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                  <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <h1 className="text-center text-base font-semibold tracking-tight text-slate-900">{title}</h1>
              <span />
            </div>
          </header>
        ) : (
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
        )}
        <div className="space-y-4">{children}</div>
      </main>
      <QuickCaptureButton />
      <BottomNav />
    </div>
  );
}
