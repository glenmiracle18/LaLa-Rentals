"use client"
import React from "react";
import { PropertyCard } from "../dashboard/(components)/propety-card";
import { useQuery } from "@tanstack/react-query";
import { getAllPropeties } from "@/(actions)/listing";

const Listings = () => {
  const { data: properties, isPending } = useQuery({
    queryKey: ["all propeties"],
    queryFn: getAllPropeties,
  });

  if (isPending) {
    return <div>Loading properties</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties?.data.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default Listings;
