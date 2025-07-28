import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PatchProjectRequest = {
  name?: string;
  json?: string;
  height?: number;
  width?: number;
  thumbnailUrl?: string;
  isTemplate?: boolean;
};

type ResponseType = void;

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const mutation = useMutation<ResponseType, Error, PatchProjectRequest>({
    mutationKey: ["project", { id }],
    mutationFn: async (data) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/api/project/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update project");
      }

      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  return mutation;
};
