export const PENDING_UPLOAD_KEY = "lifeshots-pending-upload";

export type PendingUploadPayload = {
  dataUrl: string;
  fileName: string;
  mimeType: string;
  createdAt: number;
};

export function savePendingUpload(payload: PendingUploadPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_UPLOAD_KEY, JSON.stringify(payload));
}

export function readPendingUpload(): PendingUploadPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_UPLOAD_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingUploadPayload;
    if (!parsed?.dataUrl || !parsed.fileName || !parsed.mimeType || !parsed.createdAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingUpload() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_UPLOAD_KEY);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("无法读取图片"));
    reader.readAsDataURL(file);
  });
}

export async function pendingUploadToFile(payload: PendingUploadPayload): Promise<File> {
  const response = await fetch(payload.dataUrl);
  const blob = await response.blob();
  const type = payload.mimeType || blob.type || "image/jpeg";
  return new File([blob], payload.fileName || `capture-${Date.now()}.jpg`, { type });
}
