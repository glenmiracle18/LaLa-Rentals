import React from 'react'
import { PropertyCard } from './propety-card';
import { useGetCurrentHostProperties } from '@/hooks/listings/use-current-host-properties';





const YourProperties = () => {

  const { data: properties, isLoading } = useGetCurrentHostProperties();
  console.log(properties);

  if(isLoading){
    return <div>Loading your properties</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {properties?.data.map((property) => (
      <PropertyCard key={property.id} property={property} />
    ))}
  </div>
  )
}

export default YourProperties
