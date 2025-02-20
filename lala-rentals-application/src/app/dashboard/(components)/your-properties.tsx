"use client"

import React, { useState } from 'react'
import { useGetCurrentHostProperties } from '@/hooks/listings/use-current-host-properties'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { EditPropertyModal } from './edit-properts'
import { Property } from '@prisma/client'
import { on } from 'events'

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Properties</h2>
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
                <TableCell>${property.price}/night</TableCell>
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
