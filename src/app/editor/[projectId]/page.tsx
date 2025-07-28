"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/components/editor";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Loader, TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface EditorProjectIdPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const EditorProjectIdPage = ({ params }: EditorProjectIdPageProps) => {
  const { projectId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading, isError } = useGetProject(projectId);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/api/auth/signin");
    }
  }, [session, status, router]);

  // Show loading while checking auth or fetching data
  if (status === "loading" || isLoading || !data || !session) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Failed to fetch project</p>
        <Button asChild variant="secondary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return <Editor data={data} />;
};

export default EditorProjectIdPage;
