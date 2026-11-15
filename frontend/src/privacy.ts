export const COOKIE_KEY = 'medisync.necessary-storage.v1';
export const NOTICE_VERSION = '2026-11-14';
export const NOTICE_TTL = 180 * 24 * 60 * 60 * 1000;
// No optional tracker is installed. This notice never authorizes future trackers.
export function readStorageNotice(raw: string | null, now = Date.now()): boolean {
  try {
    const value = JSON.parse(raw || 'null');
    return value?.version === NOTICE_VERSION && value?.necessary === true &&
      value?.analytics === false && value?.marketing === false &&
      Number.isFinite(value?.savedAt) && value.savedAt <= now && now - value.savedAt < NOTICE_TTL;
  } catch { return false; }
}
export function storageNotice(now = Date.now()) {
  return { version: NOTICE_VERSION, necessary: true, analytics: false, marketing: false, savedAt: now };
}
