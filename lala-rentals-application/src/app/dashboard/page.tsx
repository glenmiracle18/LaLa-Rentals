"use client";
import React, { useEffect, useState } from 'react'
import { CreatePropertyListingModal } from './(components)/create-dialoge';
import Stats from './(components)/stats';
import YourProperties from './(components)/your-properties';
import RecentBookings from './(components)/recent-bookings';



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
    
    <div className='p-6 w-full'>
      <div className="px-6 my-4 flex justify-between items-center">
        Welcome to your dashboard
        <CreatePropertyListingModal />
      </div>

      <div className=''>
        <Stats />
      </div>
      <div className='my-8 flex flex-col gap-4'>
        <YourProperties />
      </div>

      <div className='my-8 flex flex-col gap-4'>
        <RecentBookings />
      </div>
    
    </div>
  )
}

export default Dashboard
