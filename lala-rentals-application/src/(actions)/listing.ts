// actions/listing.ts
"use server"

import prisma from "@/lib/prisma";
import { formDataTypes } from "@/types";
import { auth } from "@clerk/nextjs/server";


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

