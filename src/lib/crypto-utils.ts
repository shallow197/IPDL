/**
 * Utilitaires cryptographiques isomorphes (Node.js + navigateur).
 * Signatures Ed25519 via TweetNaCl.
 */
// tweetnacl est vendorisé localement (nacl-fast.js copié depuis v1.0.3)
// pour contourner un problème de résolution Turbopack avec node_modules.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nacl = require("./nacl-fast") as {
  sign: {
    keyPair: () => { publicKey: Uint8Array; secretKey: Uint8Array };
    detached: ((msg: Uint8Array, secretKey: Uint8Array) => Uint8Array) & {
      verify: (msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array) => boolean;
    };
  };
};

// ─── Encodage hexadécimal ─────────────────────────────────────────────────────

export function toHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Hex invalide");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return arr;
}

// ─── Opérations Ed25519 ───────────────────────────────────────────────────────

export function generateKeypair(): { publicKeyHex: string; secretKeyHex: string } {
  const kp = nacl.sign.keyPair();
  return {
    publicKeyHex: toHex(kp.publicKey),
    secretKeyHex: toHex(kp.secretKey),
  };
}

export function signMessage(message: string, secretKeyHex: string): string {
  const msgBytes = new TextEncoder().encode(message);
  const sk = fromHex(secretKeyHex);
  const sig = nacl.sign.detached(msgBytes, sk);
  return toHex(sig);
}

export function verifySignature(
  message: string,
  signatureHex: string,
  publicKeyHex: string
): boolean {
  try {
    const msgBytes = new TextEncoder().encode(message);
    const sig = fromHex(signatureHex);
    const pk = fromHex(publicKeyHex);
    return nacl.sign.detached.verify(msgBytes, sig, pk);
  } catch {
    return false;
  }
}

// ─── Clé locale (localStorage) ───────────────────────────────────────────────
// Appelé uniquement côté client.

const SK_PREFIX = "ummisco_sig_sk_";
const PK_PREFIX = "ummisco_sig_pk_";

export function getOrCreateKeypair(userId: string): {
  publicKeyHex: string;
  secretKeyHex: string;
  isNew: boolean;
} {
  const storedSk = localStorage.getItem(`${SK_PREFIX}${userId}`);
  const storedPk = localStorage.getItem(`${PK_PREFIX}${userId}`);

  if (storedSk && storedPk) {
    return { secretKeyHex: storedSk, publicKeyHex: storedPk, isNew: false };
  }

  const kp = generateKeypair();
  localStorage.setItem(`${SK_PREFIX}${userId}`, kp.secretKeyHex);
  localStorage.setItem(`${PK_PREFIX}${userId}`, kp.publicKeyHex);
  return { ...kp, isNew: true };
}

export function getPublicKey(userId: string): string | null {
  return localStorage.getItem(`${PK_PREFIX}${userId}`);
}

export function clearKeypair(userId: string): void {
  localStorage.removeItem(`${SK_PREFIX}${userId}`);
  localStorage.removeItem(`${PK_PREFIX}${userId}`);
}
