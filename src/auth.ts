// Authentification de l'espace /admin : mot de passe unique + cookie de session signé (HMAC-SHA256).
// Le cookie a la forme "<expiration>.<signature>" ; il ne contient aucun secret et ne peut pas être forgé
// sans ADMIN_SECRET.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 heures, en secondes

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET;
const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD;

const encoder = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(ADMIN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Comparaison en temps constant pour ne pas révéler d'information via la durée de réponse
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Sans configuration, l'accès est toujours refusé
export function isConfigured(): boolean {
  return Boolean(ADMIN_SECRET && ADMIN_PASSWORD);
}

export async function checkPassword(password: string): Promise<boolean> {
  if (!isConfigured()) return false;
  // On compare les HMAC pour obtenir deux chaînes de même longueur
  return safeEqual(await hmac(`pw:${password}`), await hmac(`pw:${ADMIN_PASSWORD}`));
}

export async function createSessionToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${expires}.${await hmac(`session:${expires}`)}`;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!isConfigured() || !token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;

  return safeEqual(signature, await hmac(`session:${expires}`));
}
