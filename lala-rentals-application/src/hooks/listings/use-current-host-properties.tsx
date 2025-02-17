import { getCurrentHostProperties } from "@/(actions)/listing";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrentHostProperties() {
 return useQuery({
   queryKey: ["properties"],
   queryFn: getCurrentHostProperties,
 });
}

