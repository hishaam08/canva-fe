import { Editor } from "@/features/editor/components/editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shapy - Editor",
  description: "Edit your project visually using our powerful editor",
  icons: {
    icon: "/logo.ico",
  },
};

function EditorProjectIdPage() {
  return <Editor />;
}

export default EditorProjectIdPage;
