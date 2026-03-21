import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">页面不存在</h1>
        <p className="text-sm text-slate-500">链接可能已失效或照片已删除。</p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-foreground)]"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
