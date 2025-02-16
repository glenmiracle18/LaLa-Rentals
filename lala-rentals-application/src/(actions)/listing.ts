// actions/listing.ts
"use server"

import prisma from "@/lib/prisma";
import { CreateListingData } from "@/types";
import { auth } from "@clerk/nextjs/server";


export async function createListing(data: CreateListingData) {
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


    const prismaData = {
      title: data.name,
      location: data.location,
      description: data.description,
      price: Number(data.price),
      bathrooms: Number(data.bathrooms),
      bedrooms: Number(data.bedrooms),
      visitingDaysStart: new Date(data.visitingDays.from),
      visitingDaysEnd: new Date(data.visitingDays.to),
      hostId: userId,
      images: {
        createMany: {
          data: data.images.map((url: string) => ({
            url,
          })),
        },
      },
    };

    console.log("Attempting to create property with:", JSON.stringify(prismaData, null, 2));

    const listing = await prisma.property.create({
      data: prismaData,
      include: {
        images: true,
      },
    });

    console.log("Successfully created listing:", JSON.stringify(listing, null, 2));
    return { success: true, data: listing };
  } catch(error) {
    if (error instanceof Error){
        console.log("Error: ", error.stack)
    }
}
}