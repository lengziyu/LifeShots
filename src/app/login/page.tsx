import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">LifeShots</h1>
          <p className="mt-2 text-sm text-slate-500">你的日常照片时间线</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
