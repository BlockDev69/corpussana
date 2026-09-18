import { createClient } from "@libsql/client"; // Utilisez le client standard pour Astro SSR

const dbUrl = import.meta.env.TURSO_DATABASE_URL;
const dbToken = import.meta.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !dbToken) {
  throw new Error(
    "Critical error : CRITICAL ERROR: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing from your .env file"
  );
}

// Create client
export const turso = createClient({
  url: dbUrl,
  authToken: dbToken,
});
