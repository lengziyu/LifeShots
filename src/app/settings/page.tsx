import { AppShell } from "@/components/app-shell";
import { SettingsForm } from "@/components/settings-form";
import { requireUser } from "@/lib/require-user";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppShell title="设置" subtitle="基础账户配置">
      <SettingsForm displayName={user.displayName} email={user.email} />
    </AppShell>
  );
}
