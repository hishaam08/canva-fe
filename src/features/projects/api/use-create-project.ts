import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for the API request/response
type CreateProjectRequest = {
  name: string;
  json: string;
  height: number;
  width: number;
  thumbnailUrl?: string;
  isTemplate?: boolean;
};

type CreateProjectResponse = {
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
};

// Custom error type for better error handling
type ApiError = {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
};

export const useCreateProject = (token: string) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const mutation = useMutation<
    CreateProjectResponse,
    ApiError,
    CreateProjectRequest
  >({
    mutationFn: async (projectData) => {
      // Check if user is authenticated
      if (!token) {
        throw {
          message: "You must be logged in to create a project",
          status: 401,
        } as ApiError;
      }

      const response = await fetch(`${baseUrl}/api/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw {
          message: errorData?.message || "Failed to create project",
          status: response.status,
          errors: errorData?.errors,
        } as ApiError;
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast.success("Project created successfully");

      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // Optionally, you can also update the cache directly
      queryClient.setQueryData(["project", data.id], data);
    },
    onError: (error) => {
      console.error("Create project error:", error);

      if (error.status === 400) {
        toast.error(error.message || "Invalid project data");
      } else if (error.status === 401) {
        toast.error("Please log in to create a project");
      } else if (error.status === 403) {
        toast.error("You don't have permission to create projects");
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    },
  });

  return mutation;
};
