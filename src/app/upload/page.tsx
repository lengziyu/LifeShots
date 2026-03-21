import { AppShell } from "@/components/app-shell";
import { UploadForm } from "@/components/upload-form";
import { requireUser } from "@/lib/require-user";

export default async function UploadPage() {
  await requireUser();

  return (
    <AppShell title="上传照片" subtitle="记录当下生活">
      <UploadForm />
    </AppShell>
  );
}
