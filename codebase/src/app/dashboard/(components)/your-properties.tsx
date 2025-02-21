"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertOctagon, Pencil } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { EditPropertyModal } from './edit-properts'
import { Property } from '@prisma/client'

interface YourPropertiesProps {
  data: Property[];
  propertiesLoading: boolean;
  onEditComplete: () => void;
}

const YourProperties = ({ data, propertiesLoading, onEditComplete}: YourPropertiesProps) => {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  if (propertiesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if(!data.length){
    return (
      <div className='w-full'>
        <div>
        <h2 className="text-2xl font-bold">Your Properties</h2>

        </div>
        <div className='py-4 h-[200px] bg-gray-400/10 flex justify-center items-center rounded-lg flex-col font-mono my-4'>
          <AlertOctagon />
          <p>No properties found</p>
          <p>Go ahead and create a new property</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Bathrooms</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.location}</TableCell>
                <TableCell>${property.price}/month</TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.bathrooms}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingProperty(property)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onEditComplete={() => onEditComplete()}
        />
      )}
    </div>
  )
}

export default YourProperties
