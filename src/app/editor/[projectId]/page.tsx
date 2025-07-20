import { protectServer } from "@/features/auth/utils";
import { Editor } from "@/features/editor/components/editor";
import { Metadata } from "next";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Shapy - Editor",
  description: "Edit your project visually using our powerful editor",
  icons: {
    icon: "/logo.ico",
  },
};

async function EditorProjectIdPage() {
  await protectServer();
  const token = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
    },
    secret: process.env.AUTH_SECRET,
    raw: true,
  });
  console.log(token);
  return <Editor />;
}

export default EditorProjectIdPage;
