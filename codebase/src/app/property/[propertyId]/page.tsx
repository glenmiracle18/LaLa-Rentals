"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import {
  Bed,
  Bath,
  MapPin,
  Clock,
  Star,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "./(components)/booking-modal";
import { useGetIndivProperty } from "@/hooks/listings/use-get-indiv-property";
import { useQuery } from "@tanstack/react-query";
import { isPropertyBooked } from "@/(actions)/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const resolvedParams = use(params);
  const { data: property, isPending } = useGetIndivProperty(
    resolvedParams.propertyId
  );

  const { data: isBooked, refetch } = useQuery({
    queryKey: ["isBooked", resolvedParams.propertyId],
    queryFn: async () => {
      const response = await isPropertyBooked(resolvedParams.propertyId);
      return response;
    },
  });


  console.log(isBooked?.data);

  useEffect(() => {
    console.log("isBooked", isBooked);
  }, [isBooked]);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 w-screen">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!property || !property.data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center w-full font-mono">
        <h1 className="text-3xl font-bold text-gray-800">Property not found</h1>
        <p className="mt-4 text-gray-600">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {property.data.title}
        </h1>
        <Badge variant="secondary" className="text-lg">
          modern apartment
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={property.data.images[0].url || "/placeholder.svg"}
              alt={property.data.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.data.images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative h-48 rounded-lg overflow-hidden"
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${property.data?.title} - Image ${index + 2}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-md overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-6">
        {/* Location */}
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-lg">456 Ocean Dr, Miami, FL</span>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Bed className="h-5 w-5 text-primary" />
            <span className="text-lg">2 Bedrooms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="h-5 w-5 text-primary" />
            <span className="text-lg">2 Bathrooms</span>
          </div>
        </div>

        {/* Visiting Hours */}
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="h-5 w-5 text-primary" />
          <span>Visiting Hours: Weekends 10 AM - 4 PM</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold">$1200</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            Available Now
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col space-y-4">
        <Button className="w-full text-lg h-12" size="lg" onClick={() => setIsBookingModalOpen(true)}>
          Book Now
        </Button>

        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="text-sm">4.9 (120 reviews)</span>
        </div>
      </CardFooter>
    </Card>
      </div>
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.data.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Amenities
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  "Wi-Fi",
                  "Kitchen",
                  "Free parking",
                  "Air conditioning",
                  "Washer",
                  "Dryer",
                ].map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    <Star className="text-primary w-4 h-4" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Your Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isBooked?.data.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No previous bookings found.
              </p>
            ) : (
              <div className="space-y-4">
                {isBooked?.data.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <CalendarDays className="text-primary h-5 w-5" />
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`
                    ${
                      booking.status.toLowerCase() === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      booking.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    ${
                      booking.status.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                  `}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Host</h2>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Host"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  John Doe
                </h3>
                <p className="text-gray-600">Superhost</p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">
              John has been hosting for 5 years and is known for their
              exceptional hospitality and attention to detail.
            </p>
          </CardContent>
        </Card>
      </div>

      <BookingModal
        onBookingSuccess={() => refetch()}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyId={property.data.id}
        propertyTitle={property.data.title}
        previousCheckIns={
          isBooked?.data?.map((booking) => booking.checkIn) || []
        }
        previousCheckOuts={
          isBooked?.data?.map((booking) => booking.checkOut) || []
        }
      />
    </div>
  );
}
