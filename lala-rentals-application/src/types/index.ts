// types/index.ts
export type CreateListingData = {
    name: string;
    location: string;
    visitingDays: {
      from: Date; // Change to string for date serialization
      to: Date;   // Change to string for date serialization
    };
    price: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    images: string[];
  };

  