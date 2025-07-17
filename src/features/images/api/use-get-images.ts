import { unsplash } from "@/lib/unsplash";
import { useQuery } from "@tanstack/react-query";

export const useGetImages = (enabled: boolean) => {
  console.log("enabled", enabled);
  const query = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const result = await unsplash.photos.getRandom({
        collectionIds: ["317099"],
        count: 50,
      });

      if (result.errors) {
        throw new Error("Failed to fetch images");
      }

      let response = result.response;

      if (!Array.isArray(response)) {
        response = [response];
      }

      return response;
    },
    enabled,
  });

  return query;
};
