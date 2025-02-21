"use client";

import React, { useEffect, useState } from 'react'
import { CreatePropertyListingModal } from './(components)/create-dialoge';
import Stats from './(components)/stats';
import YourProperties from './(components)/your-properties';
import RecentBookings from './(components)/recent-bookings';
import { useQuery } from '@tanstack/react-query';
import { getStats, StatsData } from '@/(actions)/listing';
import { useGetCurrentHostProperties } from '@/hooks/listings/use-current-host-properties';


const Dashboard = () => {


  const [ isMounted, setIsMounted] = useState(false);

  const { data: statsData, isLoading: statsLoading, error, refetch: statsRefetch } = useQuery<StatsData>({
    queryKey: ['propertyStats'],
    queryFn: getStats
  })

  const { data: properties, isLoading: propertiesLoading, refetch } = useGetCurrentHostProperties()


  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(true);
  }, [])
  
  if(!isMounted) {
    return null;
  }



  return (
    
    <div className='p-6 w-full'>
      <div className="px-6 my-4 flex justify-between items-center">
        Welcome to your dashboard
        <CreatePropertyListingModal />
      </div>

      <div className=''>
        <Stats statsData={statsData} isPending={statsLoading} error={error} />
      </div>
      <div className='my-8 flex flex-col gap-4'>
        <YourProperties 
          onEditComplete={refetch} 
          data={properties?.data ?? []} 
          propertiesLoading={propertiesLoading} 
        />
      </div>

      <div className='my-8 flex flex-col gap-4'>
        <RecentBookings />
      </div>
    
    </div>
  )
}

export default Dashboard
