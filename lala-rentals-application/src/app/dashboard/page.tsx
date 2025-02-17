"use client";
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { CreatePropertyListingModal } from './(components)/create-dialoge';



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
    <div>
      <div className="p-6">
        Dashboardpage
        <CreatePropertyListingModal />
      </div>
    
    </div>
  )
}

export default Dashboard
