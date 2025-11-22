'use server';

import { redirect } from "next/navigation";
import { authService } from "@/services/auth-service";
import { clearSession, setSessionToken } from "@/lib/session";

export type ActionResult = { success?: string; error?: string };

export async function loginAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const redirectTo = formData.get("redirectTo")?.toString() ?? "/";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const { token } = await authService.login(email, password);
    setSessionToken(token);
    redirect(redirectTo);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return { error: message };
  }
}

export async function registerAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const role: "ADMIN" | "USER" = "USER";

  if (!email || !password || !name) {
    return { error: "Name, email, and password are required" };
  }

  try {
    await authService.register({ email, password, name, role });
    const { token } = await authService.login(email, password);
    setSessionToken(token);
    redirect("/");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return { error: message };
  }
}

export async function logoutAction() {
  clearSession();
  redirect("/");
}
