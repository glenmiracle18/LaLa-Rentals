// actions/booking.ts
"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createBooking(propertyId: string, checkIn: string, checkOut: string, totalPrice: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    console.log("Starting createBooking with userId:", userId);

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice,
        status: "PENDING",
      },
    });

    console.log("Successfully created booking:", JSON.stringify(booking, null, 2));
    revalidatePath("/dashboard");
    return { success: true, data: booking };
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
      throw error;
    }
  }
}


// Update the booking statues
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const booking = await prisma.booking.updateMany({
        where: {
          id: bookingId,
          userId,
        },
        data: {
          status,
        },
      });
  
      console.log("Successfully updated booking status:", JSON.stringify(booking, null, 2));
      revalidatePath("/dashboard");
      return { success: true, data: booking };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error: ", error.stack);
        throw error;
      }
    }
  }