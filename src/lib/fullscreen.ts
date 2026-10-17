interface VendorFullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
}

interface VendorFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

export function isFullscreenActive(): boolean {
  if (typeof document === "undefined") return false;
  const doc = document as VendorFullscreenDocument;
  return Boolean(
    doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
  );
}

export async function requestAppFullscreen(targetElement?: HTMLElement | null): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    const elem = (targetElement || document.documentElement) as VendorFullscreenElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      await elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
    }
  } catch (err) {
    console.warn("Layar penuh tidak didukung atau dibatasi oleh peramban:", err);
  }
}

export async function exitAppFullscreen(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    const doc = document as VendorFullscreenDocument;
    if (isFullscreenActive()) {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    }
  } catch (err) {
    console.warn("Gagal keluar dari layar penuh:", err);
  }
}

export async function toggleAppFullscreen(targetElement?: HTMLElement | null): Promise<void> {
  if (isFullscreenActive()) {
    await exitAppFullscreen();
  } else {
    await requestAppFullscreen(targetElement);
  }
}
