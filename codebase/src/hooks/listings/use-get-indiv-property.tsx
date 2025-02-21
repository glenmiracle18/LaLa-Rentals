"use client"

import { getPropertybyId } from "@/(actions)/listing";
import { useQuery } from "@tanstack/react-query";


export const useGetIndivProperty = (propertyId: string) =>
    useQuery({
        queryKey: ["property", propertyId],
        queryFn: () => getPropertybyId(propertyId),
    });