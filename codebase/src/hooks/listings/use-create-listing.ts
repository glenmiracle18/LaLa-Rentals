import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createListing } from "@/(actions)/listing";
import { formDataTypes } from "@/types";

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: formDataTypes) => createListing(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });

      toast({
        title: "Success!",
        description: "Property listing created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
};
