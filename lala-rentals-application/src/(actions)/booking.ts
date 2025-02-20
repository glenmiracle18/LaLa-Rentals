
"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { title } from "process";

export async function createBooking(propertyId: string, checkIn: string, checkOut: string, totalPrice: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
     throw new Error("Unautorized");
    }

  
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
    return { 
      success: true, 
      data: booking ,
    };
  } catch (error) {
    console.log("Error: ", error);
    return { 
      success: false, 
    };
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

  export async function isPropertyBooked(propertyId: string, checkIn?: Date, checkOut?: Date) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const booking = await prisma.booking.findMany({
        where: {
          propertyId,
          userId,
          // Only include date checks if dates are provided
          ...(checkIn && checkOut ? {
            OR: [
              {
                // New booking starts during an existing booking
                AND: {
                  checkIn: { lte: checkOut },
                  checkOut: { gte: checkIn }
                }
              }
            ]
          } : {})
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return { success: true, booked: !!booking, data: booking};
  
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error: ", error.stack);
        throw error;
      }
    }
  }

  export async function recentBookings() {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        throw new Error("Unauthorized");
      }
  
      const bookings = await prisma.booking.findMany({
        where: {
          property:{
            hostId: userId,
          }
        },
        include: {
          property: true,
          user: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
  
      return { success: true, data: bookings };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error: ", error.stack);
        throw error;
      }
    }
  }