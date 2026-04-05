import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const HEX64 = /^[0-9a-fA-F]{64}$/;

function keyFromHex(hex: string, label: string): Buffer {
  if (!hex || hex.length !== 64 || !HEX64.test(hex)) {
    throw new Error(`${label} must be a 64-char hex string (32 bytes)`);
  }
  return Buffer.from(hex, "hex");
}

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) {
    throw new Error("ENCRYPTION_KEY must be a 64-char hex string (32 bytes)");
  }
  return keyFromHex(hex, "ENCRYPTION_KEY");
}

/** 마이그레이션·스크립트용 — 평문을 지정 키로 암호화 */
export function encryptWithKey(plainText: string, keyHex: string): string {
  const key = keyFromHex(keyHex, "encryption key");
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/** 마이그레이션·스크립트용 — 지정 키로 복호화 */
export function decryptWithKey(encryptedBase64: string, keyHex: string): string {
  const key = keyFromHex(keyHex, "encryption key");
  const data = Buffer.from(encryptedBase64, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const cipherText = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(cipherText) + decipher.final("utf8");
}

export function encrypt(plainText: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // iv(12) + authTag(16) + cipherText → base64
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(encryptedBase64: string): string {
  const key = getKey();
  const data = Buffer.from(encryptedBase64, "base64");

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const cipherText = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(cipherText) + decipher.final("utf8");
}

export function maskResident(_encrypted: string): string {
  return "******-*******";
}

export function maskAccount(encrypted: string): string {
  try {
    const plain = decrypt(encrypted);
    if (plain.length <= 4) return "****";
    return "***" + plain.slice(-4).replace(/./g, (_, i) => (i < 2 ? "*" : _));
  } catch {
    return "***-****-***-**";
  }
}
