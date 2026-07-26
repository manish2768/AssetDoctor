// Web Crypto API - Bank-Grade AES-GCM 256-bit Key derivation & Encryption

// Generate or derive an AES-GCM 256-bit Key from a passphrase
export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt plain text or JSON string to base64 encrypted payload
export async function encryptData(plainText: string, secretPassphrase: string = "AssetDoctorDefaultVaultKey"): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const key = await deriveKey(secretPassphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(plainText)
  );

  // Combine salt, iv, and encrypted data into a single transportable object
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);

  // Convert to Base64
  let binary = '';
  const len = combined.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

// Decrypt base64 payload back to plain text
export async function decryptData(cipherTextBase64: string, secretPassphrase: string = "AssetDoctorDefaultVaultKey"): Promise<string> {
  const binaryString = atob(cipherTextBase64);
  const len = binaryString.length;
  const combined = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    combined[i] = binaryString.charCodeAt(i);
  }

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const key = await deriveKey(secretPassphrase, salt);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

// Secure SHA-256 PIN hashing helper
export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(`AssetDoctorPin_${pin}`));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
