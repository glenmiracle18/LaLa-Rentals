'use client';

import { StatsData } from '@/(actions)/listing';
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, Home, Tag, Users } from 'lucide-react';

interface StatsProps {
  statsData: StatsData | undefined;
  isPending: boolean;
  error: unknown;
}

const Stats: React.FC<StatsProps> = ({ statsData, isPending, error }) => {
  

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="flex flex-col p-4 items-start bg-white shadow-sm rounded-lg animate-pulse"
          >
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-200 rounded mt-4" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading stats: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Properties',
      value: statsData?.totalProperties ?? 0,
      icon: <Home className="h-4 w-4" />
    },
    {
      name: 'Active Bookings',
      value: statsData?.activeBookings ?? 0,
      icon: <Users className="h-4 w-4" />
    },
    {
      name: 'Total Revenue',
      value: `$${(statsData?.totalRevenue ?? 0).toLocaleString()}`,
      icon: <CircleDollarSign className="h-4 w-4" />
    },
    {
      name: 'Occupancy Rate',
      value: `${(statsData?.occupancyRate ?? 0).toFixed(1)}%`,
      icon: <Tag className="h-4 w-4" />
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          className="flex flex-col p-4 items-start bg-white shadow-sm rounded-lg"
          key={stat.name}
        >
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {stat.icon}
            {stat.name}
          </CardTitle>
          <CardContent className="text-start text-2xl font-bold text-sky-600 pt-2">
            {stat.value}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Stats