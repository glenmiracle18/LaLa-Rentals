// types/index.ts
export type formDataTypes = {
    title: string,
    description: string,
    price: string,
    address: string,
    bathrooms: number,
    bedrooms: number,
    visitingHours: string,
    images: string[],
  }

 

  export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

  export interface BookingTypes {
    id: string
    checkIn: Date
    checkOut: Date
    totalPrice: number
    status: BookingStatus
    createdAt: Date
    updatedAt: Date
    propertyId: string
    userId: string
    property: { title: string }
    user: { 
      email: string
      username: string
      profileImage: string
    }
  }