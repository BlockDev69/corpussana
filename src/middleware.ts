import { defineMiddleware } from "astro:middleware";
import { SESSION_COOKIE, isValidSession } from "./auth";

// Protège toutes les routes /admin, sauf la page de connexion
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.replace(/\/+$/, "") || "/";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminRoute) return next();

  if (pathname !== "/admin/login") {
    const token = context.cookies.get(SESSION_COOKIE)?.value;
    if (!(await isValidSession(token))) {
      return context.redirect("/admin/login");
    }
  }

  // Les pages d'administration ne doivent jamais être mises en cache
  const response = await next();
  response.headers.set("Cache-Control", "no-store");
  return response;
});
