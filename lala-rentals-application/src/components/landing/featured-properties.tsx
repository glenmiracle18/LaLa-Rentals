import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import Listing1 from "../../../public/photos/listing1.png"
import Listing2 from "../../../public/photos/listing2.png"
import Listing3 from "../../../public/photos/listing3.png"




const FeaturedProperties = () => {

  const features = [
    {image: Listing1, title: "Beautiful 1 Bedroom Apartment", location: "City, State", price: "$1,500/month"},
    {image: Listing2, title: "Beautiful 2 Bedroom Apartment", location: "City, State", price: "$1,600/month"},
    {image: Listing3, title: "Beautiful 3 Bedroom Apartment", location: "City, State", price: "$1,700/month"}
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Featured Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((listing) => (
          <Card key={listing.title}>
            <CardHeader>
              <Image
                src={listing.image}
                width={300}
                height={200}
                alt="Property Image"
                className="rounded-lg object-cover w-full"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{listing.title}</CardTitle>
              <p className="text-muted-foreground">
                <MapPin className="inline mr-1" size={16} />
                {listing.location}
              </p>
              <p className="font-semibold mt-2">{listing.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </section>
  )
}

export default FeaturedProperties
