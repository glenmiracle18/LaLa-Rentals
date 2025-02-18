// actions/listing.ts
"use server"

import prisma from "@/lib/prisma";
import { formDataTypes } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


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

// get all propeties
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
    // revalidatePath("/property/[id]");
    return { success: true, data: property };
  } catch(error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    
  }
}

