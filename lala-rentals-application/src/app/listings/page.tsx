"use client"
import { PropertyCard } from "../dashboard/(components)/propety-card"
import { useQuery } from "@tanstack/react-query"
import { getAllPropeties } from "@/(actions)/listing"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const Listings = () => {
  const {
    data: properties,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["all properties"],
    queryFn: getAllPropeties,
  })

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 w-screen">
        <h1 className="text-3xl font-bold mb-6">Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[370px]  w-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>There was an error loading the properties. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-mono">Properties</h1>
      {properties?.data && properties.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.data.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <Alert variant='destructive' className="font-mono">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No properties found</AlertTitle>
          <AlertDescription>
            There are currently no properties listed. Check back later for new listings.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default Listings

