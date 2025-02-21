import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  buttonVariants } from "@/components/ui/button";
import { Bed, Bath, Clock } from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: { url: string }[];
  bedrooms: number;
  bathrooms: number;
  visitingHours: string;
}

export function PropertyCard({ property }: { property: Property }) {

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={property.images[0].url || "/placeholder.svg"}
          alt={property.title}
          layout="fill"
          objectFit="cover"
        />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          ${property.price}/month
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {property.location}
        </p>
        <p className="text-sm line-clamp-2 mb-4">{property.description}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms}{" "}
            {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms}{" "}
            {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {property.visitingHours}
        </div>
        <Link
          href={`/property/${property.id}`}
          className={buttonVariants({
          variant: "default"})}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
