import CryptoJS from "crypto-js";

const keylength = 16;

function crypto(content: string, key: string, action = "encrypt"): string {
  const keyorigin = key.split("");
  const key16: string = keyorigin.length < 16 ? [...keyorigin, ...Array.from(new Array(keylength - keyorigin.length)).map(() => "0")].join("") : key;
  const keyutf = CryptoJS.enc.Utf8.parse(key16);
  const iv = { iv: CryptoJS.enc.Base64.parse(key16) };

  if (action === "decrypt") {
    const raw = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(content) }, keyutf, iv);
    return CryptoJS.enc.Utf8.stringify(raw);
  } else {
    return CryptoJS.AES.encrypt(content, keyutf, iv).toString();
  }
}

export default crypto;
