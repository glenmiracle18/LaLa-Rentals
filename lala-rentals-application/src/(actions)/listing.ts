// actions/listing.ts
"use server"

import prisma from "@/lib/prisma";
import { CreateListingData } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function createListing(data: CreateListingData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!data) {
      throw new Error("No data provided");
    }

    const listing = await prisma.property.create({
      data: {
        title: data.name,
        location: data.location,
        description: data.description,
        price: data.price,
        bathrooms: data.bathrooms,
        bedrooms: data.bedrooms,
        visitingDaysStart: data.visitingDays.from,
        visitingDaysEnd: data.visitingDays.to,
        hostId: userId,
        images: {
          createMany: {
            data: data.images.map((url) => ({
              url,
            })),
          },
        },
      },
      include: {
        images: true,
      },
    });

    return listing;
  } catch (error) {
    console.error("[CREATE_LISTING]", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create listing");
  }
}