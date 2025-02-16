  
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { CreateListingData } from "@/types";
  import { useRouter } from "next/navigation";
  import { useToast } from "@/hooks/use-toast";
import { createListing } from "@/(actions)/listing";
  
  export const useCreateListing = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast();
  
    return useMutation({
      mutationFn: (data: CreateListingData) => createListing(data),
      onSuccess: (data) => {
        // Invalidate the listings query to refetch the updated list
        queryClient.invalidateQueries({
          queryKey: ["listings"]
        });
  
        toast({
          title: "Success!",
          description: "Property listing created successfully",
        });
  
        // router.push(`/properties/${data.id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };