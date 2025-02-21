
"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

      // no need to verify if the user is a host, since we already did that at the middleware

      const existingBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { property: true }
      });

      if (!existingBooking) {
        return { success: false, message: "Booking not found" };
      }

      // Verify the user is the host of the property
      if (existingBooking.property.hostId !== userId) {
        return { success: false, message: "Unauthorized: Not the property host" };
      }
  
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          property: true,
          user: true
        }
      });


  
      console.log("Successfully updated booking status:", JSON.stringify(updatedBooking, null, 2));
      revalidatePath("/dashboard");
      return { success: true, data: existingBooking };
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


  