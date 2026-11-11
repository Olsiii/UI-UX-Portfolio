import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin sign-in. One account, with the credentials stored in environment
 * variables (ADMIN_EMAIL, ADMIN_PASSWORD). A signed, http-only cookie keeps
 * the session for a week.
 */
const COOKIE = "admin_session";
const WEEK = 60 * 60 * 24 * 7;

const email = () => (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = () => process.env.ADMIN_PASSWORD ?? "";
const secret = () => process.env.ADMIN_SESSION_SECRET || `${password()}:${email()}:session`;

export const adminReady = () => Boolean(email() && password().length >= 8);

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(sign(a));
  const y = Buffer.from(sign(b));
  return timingSafeEqual(x, y);
}

export function checkCredentials(inputEmail: string, inputPassword: string) {
  if (!adminReady()) return false;
  // Compare both every time, so the response doesn't reveal which one was wrong.
  const okEmail = same(inputEmail.trim().toLowerCase(), email());
  const okPassword = same(inputPassword, password());
  return okEmail && okPassword;
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + WEEK;
  (await cookies()).set(COOKIE, `${expires}.${sign(String(expires))}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminReady()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const [expires, mac] = value.split(".");
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false;
  const expected = sign(expires);
  return mac.length === expected.length && timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
