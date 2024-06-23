"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from "../constants";

// Cookie-Based Sessions
// Docs: https://nextjs.org/docs/app/building-your-application/authentication#session-management

export async function createSession(uid: string) {
  cookies().set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/"
  });

  redirect(HOME_ROUTE);
}

export async function getSession() {
  return cookies().get(SESSION_COOKIE_NAME)?.value || null;
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);

  redirect(ROOT_ROUTE);
}
