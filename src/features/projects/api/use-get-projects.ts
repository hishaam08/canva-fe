import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export interface Project {
  id: string;
  name: string;
  userId: string;
  json: string;
  height: number;
  width: number;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponseDto {
  data: Project[];
  nextPage: number | null;
}

export const useGetProjects = () => {
  const { data: session } = useSession();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const query = useInfiniteQuery<ProjectListResponseDto, Error>({
    initialPageParam: 0,
    queryKey: ["projects"],
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    queryFn: async ({ pageParam }) => {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${baseUrl}/api/project/user/${session?.user.id}?skip=${pageParam}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      return res.json();
    },
  });

  return query;
};
