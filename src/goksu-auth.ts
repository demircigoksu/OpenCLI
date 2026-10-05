/**
 * Göksu fork yaması: yerel daemon için gizli anahtar ve eklenti kimliği sabitleme.
 *
 * - ~/.opencli/daemon-token: CLI ile daemon arasındaki gizli anahtar. Yoksa
 *   ilk kullanımda rastgele üretilir. Bu dosyayı okuyamayan bir yerel program
 *   daemon'a komut gönderemez.
 * - ~/.opencli/allowed-extension-id: varsa, daemon'a sadece bu kimlikteki
 *   Chrome eklentisi bağlanabilir.
 *
 * Yukarı akıştan (upstream) gelen güncellemelerde çakışma çıkmasın diye bütün
 * mantık bu dosyada tutulur; diğer dosyalarda sadece birkaç satırlık çağrı var.
 */

import { randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const GOKSU_TOKEN_HEADER = 'x-opencli-token';

const OPENCLI_DIR = join(homedir(), '.opencli');
const TOKEN_PATH = join(OPENCLI_DIR, 'daemon-token');
const EXTENSION_ID_PATH = join(OPENCLI_DIR, 'allowed-extension-id');

let cachedToken: string | null = null;

export function getDaemonToken(): string {
  if (cachedToken) return cachedToken;
  try {
    const existing = readFileSync(TOKEN_PATH, 'utf-8').trim();
    if (existing.length >= 32) {
      cachedToken = existing;
      return existing;
    }
  } catch {
    // Dosya yok: aşağıda üretilecek.
  }
  mkdirSync(OPENCLI_DIR, { recursive: true });
  const token = randomBytes(32).toString('hex');
  writeFileSync(TOKEN_PATH, token, { encoding: 'utf-8', mode: 0o600 });
  cachedToken = token;
  return token;
}

export function isValidDaemonToken(value: string | string[] | undefined): boolean {
  if (typeof value !== 'string' || value.length === 0) return false;
  const expected = Buffer.from(getDaemonToken(), 'utf-8');
  const given = Buffer.from(value, 'utf-8');
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

/** Dosya yoksa null döner; bu durumda eski (upstream) davranış geçerli olur. */
export function getAllowedExtensionOrigin(): string | null {
  try {
    if (!existsSync(EXTENSION_ID_PATH)) return null;
    const id = readFileSync(EXTENSION_ID_PATH, 'utf-8').trim();
    if (!/^[a-p]{32}$/.test(id)) return null;
    return `chrome-extension://${id}`;
  } catch {
    return null;
  }
}
