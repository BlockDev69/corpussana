import type { APIRoute } from "astro";
import { SESSION_COOKIE } from "../../auth";

export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(SESSION_COOKIE, { path: "/admin" });
  return redirect("/admin/login");
};
