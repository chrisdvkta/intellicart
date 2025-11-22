import { cookies } from "next/headers";
import type { SessionUser } from "./types";

export const getSessionToken = () => cookies().get("ic_token")?.value;

export const clearSession = () => {
  cookies().delete("ic_token");
};

export const setSessionToken = (token: string) => {
  cookies().set("ic_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
};

export const getSessionUser = (): SessionUser | null => {
  const token = getSessionToken();
  if (!token) return null;

  try {
    const payloadSegment = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadSegment, "base64").toString());
    return {
      email: payload.user?.email,
      admin: Boolean(payload.user?.admin),
    };
  } catch (error) {
    return null;
  }
};
