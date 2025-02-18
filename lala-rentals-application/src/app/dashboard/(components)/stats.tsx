import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { CircleDollarSign, Home, Tag } from 'lucide-react'
import React from 'react'


const stats: { name: string; value: number | string }[] = [
    { name: 'Total Properties', value: 25 },
    { name: 'Active Bookings', value: 10 },
    { name: 'Total Revenue', value: 1000 },
    { name: "Occupancy Rate", value: 0.4 }
]
const Stats = () => {
   
  return (
    <>
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      {stats.map((stat) => (
         <Card className='flex flex-col p-4 items-start bg-white shadow-sm rounded-lg' key={stat.name}>
            <CardTitle className='text-lg font-semibold text-gray-800'>
                {stat.name}
            </CardTitle>
            <CardContent className='text-start text-2xl font-bold text-sky-600'>
                {stat.value}
            </CardContent>
         </Card>
      ))}

    </div>
    </>
  )
}

export default Stats
