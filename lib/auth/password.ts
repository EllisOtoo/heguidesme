import crypto from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function timingSafeEqual(a: Buffer, b: Buffer) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (error, derivedKey) => {
        if (error) return reject(error);
        resolve(derivedKey as Buffer);
      }
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derivedKey = await scryptAsync(password, salt);

  const saltB64 = salt.toString("base64url");
  const hashB64 = derivedKey.toString("base64url");

  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${saltB64}$${hashB64}`;
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  const parts = passwordHash.split("$");
  if (parts.length !== 6) return false;
  const algorithm = parts[0];
  if (algorithm !== "scrypt") return false;

  const nRaw = parts[1];
  const rRaw = parts[2];
  const pRaw = parts[3];
  const saltB64 = parts[4];
  const hashB64 = parts[5];
  const n = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;
  if (n !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltB64, "base64url");
    expected = Buffer.from(hashB64, "base64url");
  } catch {
    return false;
  }

  const actual = await scryptAsync(password, salt);
  return timingSafeEqual(actual, expected);
}
