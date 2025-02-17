"use client";
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { CreatePropertyListingModal } from './(components)/create-dialoge';
import Stats from './(components)/stats';
import YourProperties from './(components)/your-properties';
import { useGetCurrentHostProperties } from '@/hooks/listings/use-current-host-properties';



const Dashboard = () => {

  const [ isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(true);
  }, [])
  
  if(!isMounted) {
    return null;
  }



  return (
    
    <div className='p-6'>
      <div className="px-6 my-4 flex justify-between items-center">
        Welcome to your dashboard
        <CreatePropertyListingModal />
      </div>

      <div className=''>
        <Stats />
      </div>
      <div className='my-8 flex flex-col gap-4'>
        <p>Your Properties</p>
        <YourProperties />
      </div>
    
    </div>
  )
}

export default Dashboard
