/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Audio MIME candidate list ordered by preference for modern mobile and desktop browsers:
 * - Android Chrome: prefers audio/webm codecs=opus or audio/webm
 * - iOS Safari (iOS 14.8+): prefers audio/mp4 or audio/aac
 * - Fallbacks: audio/ogg, audio/wav
 */
const AUDIO_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/wav',
];

export function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return 'audio/webm';
  }

  if (typeof MediaRecorder.isTypeSupported !== 'function') {
    // If browser doesn't expose isTypeSupported, let MediaRecorder use default or fallback
    return '';
  }

  for (const candidate of AUDIO_MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }

  return ''; // Browser default
}

export function isMediaRecorderSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const hasUserMedia = !!(
    window.navigator &&
    window.navigator.mediaDevices &&
    typeof window.navigator.mediaDevices.getUserMedia === 'function'
  );
  return hasUserMedia && typeof MediaRecorder !== 'undefined';
}

export function isSecureContextValid(): boolean {
  if (typeof window === 'undefined') return true;
  // In dev / preview, window.isSecureContext or localhost / 127.0.0.1 or https
  if (window.isSecureContext) return true;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result) {
        reject(new Error('Failed to read audio blob'));
        return;
      }
      // Result is typically "data:audio/webm;base64,AAAA..."
      const base64Index = result.indexOf('base64,');
      if (base64Index !== -1) {
        resolve(result.substring(base64Index + 7));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}
