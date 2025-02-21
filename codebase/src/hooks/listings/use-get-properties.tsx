import { getAllPropeties} from "@/(actions)/listing";
import { useQuery } from "@tanstack/react-query";

export function useGetAllPropeties() {
 return useQuery({
   queryKey: ["all propeties"],
   queryFn: getAllPropeties,
 });
}

