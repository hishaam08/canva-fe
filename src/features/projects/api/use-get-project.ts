import { useQuery } from "@tanstack/react-query";

export type Project = {
  id: string;
  name: string;
  userId: string;
  json: string;
  height: number;
  width: number;
  thumbnailUrl?: string | null;
  isTemplate?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export const useGetProject = (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const query = useQuery<Project>({
    enabled: !!id,
    queryKey: ["project", { id }],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/api/project/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const data = await response.json();
      return data;
    },
  });

  return query;
};
