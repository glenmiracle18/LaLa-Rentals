"use client"

import { useState, use } from "react"
import Image from "next/image"
import { Bed, Bath, MapPin, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "./(components)/booking-modal"
import { useGetIndivProperty } from "@/hooks/listings/use-get-indiv-property"

export default function PropertyPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const resolvedParams = use(params)
  const { data: property, isPending } = useGetIndivProperty(resolvedParams.propertyId)

  if (isPending) {
    return <div>Loading property...</div>
  }

  if(!property || !property.data){
    return <div>Property not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{property.data.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <Image
            src={property.data.images[0].url || "/placeholder.svg"}
            alt={property.data.title}
            width={800}
            height={600}
            className="rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            {property.data.images.slice(1, 3).map((image, index) => (
              <Image
                key={index}
                src={image.url || "/placeholder.svg"}
                alt={`${property.data?.title} - Image ${index + 2}`}
                width={400}
                height={300}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg">
            <MapPin className="text-primary" />
            <span>{property.data.location}</span>
          </div>

          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center">
              <Bed className="mr-2 text-primary" />
              <span>{property.data.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center">
              <Bath className="mr-2 text-primary" />
              <span>{property.data.bathrooms} Bathrooms</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-lg">
            <Clock className="text-primary" />
            <span>Visiting Hours: {property.data.visitingHours}</span>
          </div>

          <div className="flex items-center space-x-2 text-2xl font-bold">
            <DollarSign className="text-primary" />
            <span>{property.data.price} per night</span>
          </div>

          <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
            Book Now
          </Button>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{property.data.description}</p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Host</h2>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyId={property.data.id}
        propertyTitle={property.data.title}
      />
    </div>
  )
}