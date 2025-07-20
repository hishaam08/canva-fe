// import { useQuery } from "@tanstack/react-query";
// import { getSession, useSession } from "next-auth/react";

// export const useTestApi = () => {
//   const { data: session } = useSession();

//   const token =
//     (session as any)?.accessToken || (session?.user as any)?.accessToken;
//   console.log("token:", token);

//   const query = useQuery({
//     queryKey: ["test"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:5287/api/test/protected", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to generate image");
//       }

//       return response.json();
//     },
//     enabled: !!token,
//   });

//   return query;
// };
