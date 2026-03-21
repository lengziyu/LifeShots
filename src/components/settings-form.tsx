"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  displayName: string;
  email: string;
};

type ThemeName = "purple" | "sunset" | "mint";

const THEME_STORAGE_KEY = "lifeshots-theme";
const DEFAULT_THEME: ThemeName = "purple";

const themes: Array<{ value: ThemeName; label: string; hint: string }> = [
  { value: "purple", label: "紫色", hint: "默认" },
  { value: "sunset", label: "落日", hint: "暖色" },
  { value: "mint", label: "薄荷", hint: "清新" },
];

function isThemeName(value: string | null): value is ThemeName {
  return value === "purple" || value === "sunset" || value === "mint";
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function SettingsForm({ displayName: initialName, email }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    const saved = localStorage.getItem(THEME_STORAGE_KEY);

    if (isThemeName(saved)) {
      setTheme(saved);
      applyTheme(saved);
      return;
    }

    if (isThemeName(current)) {
      setTheme(current);
      applyTheme(current);
      return;
    }

    setTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }, []);

  function handleThemeChange(nextTheme: ThemeName) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

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

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">主题</p>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((item) => {
            const active = theme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleThemeChange(item.value)}
                className={`rounded-2xl border px-2 py-2 text-left transition ${
                  active
                    ? "border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)]"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs opacity-80">{item.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        disabled={loading}
        onClick={save}
        className="h-11 w-full rounded-2xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-foreground)]"
      >
        保存设置
      </button>
      <button
        onClick={logout}
        className="h-11 w-full rounded-2xl bg-[var(--secondary-soft)] text-sm font-semibold text-[var(--secondary-foreground)]"
      >
        退出登录
      </button>
    </div>
  );
}
