import CryptoJS from "crypto-js";

const KEY_LENGTH = 16;

/**
 * Normalize key to 16 characters by padding with '0' or truncating
 */
export function normalizeKey(key: string): string {
  if (key.length >= KEY_LENGTH) {
    return key.slice(0, KEY_LENGTH);
  }
  return key.padEnd(KEY_LENGTH, '0');
}

/**
 * Encrypt or decrypt content using AES
 */
export function crypto(content: string, key: string, action = "encrypt"): string {
  const normalizedKey = normalizeKey(key);
  const keyUtf = CryptoJS.enc.Utf8.parse(normalizedKey);
  const iv = { iv: CryptoJS.enc.Base64.parse(normalizedKey) };

  if (action === "decrypt") {
    try {
      const raw = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(content) },
        keyUtf,
        iv
      );
      return CryptoJS.enc.Utf8.stringify(raw);
    } catch (e) {
      console.error("Decryption failed:", e);
      return "";
    }
  } else {
    return CryptoJS.AES.encrypt(content, keyUtf, iv).toString();
  }
}

export default crypto;
