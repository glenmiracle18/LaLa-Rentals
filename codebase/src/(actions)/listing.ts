// actions/listing.ts
"use server"

import prisma from "@/lib/prisma";
import { formDataTypes } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type Property } from '@prisma/client';

export async function createListing(data: formDataTypes) {
  if (!data) {
    throw new Error("No data provided");
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    console.log("Starting createListing with userId:", userId);
    console.log("Received data:", JSON.stringify(data, null, 2));

    const listing = await prisma.property.create({
      data: {
        title: data.title,
        location: data.address,
        description: data.description,
        price: data.price,
        bathrooms: Number(data.bathrooms),
        bedrooms: Number(data.bedrooms),
        visitingHours: data.visitingHours,
        hostId: userId,
        images: {
          createMany: {
            data: data.images.map((url: string) => ({
              url,
            })),
          },
        },
      },
      include: {
        images: true,
      },
    });

    console.log("Successfully created listing:", JSON.stringify(listing, null, 2));
    revalidatePath("/dashboard");
    return { success: true, data: listing };
  } catch(error) {
    if (error instanceof Error){
        console.log("Error: ", error.stack)
    }
}
}

export async function getCurrentHostProperties() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const properties = await prisma.property.findMany({
      where: {
        hostId: userId,
      },
      include: {
        images: true,
      },
    });
    return { success: true, data: properties };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
  }
}

export async function getAllPropeties() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const properties = await prisma.property.findMany({
      include: {
        images: true,
      },
    });
    return { success: true, data: properties };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
  }
}

export async function getPropertybyId(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });
    return { success: true, data: property };
  } catch(error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
  }
}

interface UpdateResponse {
  success: boolean;
  data?: Property;
  error?: string;
}

export async function updateProperty(data: Property & { id: string }): Promise<UpdateResponse> {
  try {
    const {
      id,
      ...updateData
    } = data;

    const property = await prisma.property.update({
      where: { 
        id: id 
      },
      data: {
        ...updateData,
        updatedAt: new Date(), // Automatically update the timestamp
      },
    });

    return { 
      success: true, 
      data: property 
    };

  } catch(error) {
    if (error instanceof Error) {
      console.error("Error updating property:", error.stack);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

interface DeleteResponse {
  success: boolean;
  data?: Property;
  error?: string;
}

export async function deleteProperty(id: string): Promise<DeleteResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!existingProperty) {
      return {
        success: false,
        error: "Property not found"
      };
    }

    if (existingProperty.hostId !== userId) {
      return {
        success: false,
        error: "You don't have permission to delete this property"
      };
    }

    const property = await prisma.property.delete({
      where: { id }
    });

    return { 
      success: true, 
      data: property 
    };

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting property:", error.stack);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

export interface StatsData {
  totalProperties: number;
  activeBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}

export async function getStats(): Promise<StatsData> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const properties = await prisma.property.findMany({
      where: {
        hostId: userId
      },
      include: {
        bookings: true
      }
    });

    const totalProperties = properties.length;
    const activeBookings = properties.reduce(
      (total, property) => total + property.bookings.length,
      0
    );

    const totalRevenue = properties.reduce(
      (total, property) => total + parseFloat(property.price),
      0
    );

    const occupancyRate = totalProperties === 0 ? 0 : (activeBookings / totalProperties) * 100;

    return {
      totalProperties,
      activeBookings,
      totalRevenue,
      occupancyRate
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}