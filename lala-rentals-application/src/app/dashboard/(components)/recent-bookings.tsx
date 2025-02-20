"use client"

import type React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { recentBookings, updateBookingStatus } from "@/(actions)/booking"
import { AlertCircle, Calendar, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { BookingStatus, BookingTypes } from "@/types"



const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const colorMap: Record<BookingStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  return <Badge className={`${colorMap[status]} capitalize`}>{status.toLowerCase()}</Badge>
}

const UpdateBookingModal: React.FC<{ booking: BookingTypes }> = ({ booking }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(booking.id, newStatus)
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${newStatus.toLowerCase()}.`,
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      })
    }
  }

 


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button onClick={() => handleUpdateStatus("PENDING")} variant="outline">
            Pending
          </Button>
          <Button onClick={() => handleUpdateStatus("CONFIRMED")} variant="outline">
            Confirm
          </Button>
          <Button onClick={() => handleUpdateStatus("CANCELLED")} variant="outline">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const RecentBookings: React.FC = () => {
  const {
    data: myBookings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: recentBookings,
  })

  if (isPending) {
    return <div className="text-center">Loading recent bookings...</div>
  }
 

  if (isError) {
    return (
      <div className="flex items-center flex-col justify-center h-96 bg-slate-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">There was an error</h2>
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Bookings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {myBookings?.data.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.property.title}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(booking.checkIn).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(booking.checkOut).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  {booking.totalPrice.toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              {/* <TableCell>
                <UpdateBookingModal booking={booking} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RecentBookings

