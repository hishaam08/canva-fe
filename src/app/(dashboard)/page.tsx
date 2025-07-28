import { protectServer } from "@/features/auth/utils";
import { Banner } from "./banner";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { ProjectsSection } from "./projects-section";

export default async function Home() {
  await protectServer();

  const token = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
    },
    secret: process.env.AUTH_SECRET,
    raw: true,
    cookieName: "__Secure-authjs.session-token",
  });

  return (
    <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      <Banner token={token} />
      <ProjectsSection />
    </div>
  );
}
