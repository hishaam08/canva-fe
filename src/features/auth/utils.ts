import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const protectServer = async () => {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
};

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop();
    if (cookiePart) {
      return cookiePart.split(";").shift() || null;
    }
  }
  return null;
}
