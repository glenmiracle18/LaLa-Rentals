// types/index.ts
export type CreateListingData = {
    name: string;
    location: string;
    visitingDays: {
      from: Date;
      to: Date;
    };
    price: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    images: string[];
  };