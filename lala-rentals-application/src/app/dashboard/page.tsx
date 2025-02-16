"use client";
import { Button } from '@/components/ui/button'
import React from 'react'
import PropertyListingForm from './(components)/create-dialoge'


const Dashboard = () => {
  return (
    <div>
      <div className="flex gap-10 h-screen">
        Dashboardpage
        <PropertyListingForm />
      </div>
    
    </div>
  )
}

export default Dashboard
