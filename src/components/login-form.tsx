"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login"
          ? { email, password }
          : {
              email,
              password,
              displayName,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "请求失败");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/50 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          className={`h-10 rounded-xl text-sm font-semibold ${
            mode === "login"
              ? "bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] shadow-sm ring-1 ring-[var(--accent-soft-border)]"
              : "text-slate-500"
          }`}
          onClick={() => setMode("login")}
        >
          登录
        </button>
        <button
          type="button"
          className={`h-10 rounded-xl text-sm font-semibold ${
            mode === "register"
              ? "bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] shadow-sm ring-1 ring-[var(--accent-soft-border)]"
              : "text-slate-500"
          }`}
          onClick={() => setMode("register")}
        >
          注册
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "register" ? (
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
            placeholder="昵称"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            minLength={2}
          />
        ) : null}

        <input
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={mode === "register" ? 8 : 6}
        />

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <button
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-60"
        >
          {loading ? "提交中..." : mode === "login" ? "登录" : "创建账号"}
        </button>
      </form>
    </div>
  );
}
