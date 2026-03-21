"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  displayName: string;
  email: string;
};

export function SettingsForm({ displayName: initialName, email }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-3xl border border-white/50 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs text-slate-500">邮箱</p>
        <p className="text-sm font-semibold text-slate-800">{email}</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">昵称</span>
        <input
          className="h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </label>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button disabled={loading} onClick={save} className="h-11 w-full rounded-2xl bg-slate-900 text-sm font-semibold text-white">
        保存设置
      </button>
      <button onClick={logout} className="h-11 w-full rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
        退出登录
      </button>
    </div>
  );
}
