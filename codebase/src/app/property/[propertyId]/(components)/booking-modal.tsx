import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, isSameDay } from "date-fns"
import { CalendarIcon, Info } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { createBooking } from "@/(actions)/booking"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  checkIn: z
    .date({
      required_error: "Check-in date is required.",
    })
    .nullish(),
  checkOut: z
    .date({
      required_error: "Check-out date is required.",
    })
    .nullish(),
})

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  propertyTitle: string
  previousCheckIns: Date[]
  previousCheckOuts: Date[]
  onBookingSuccess: () => void
}

export function BookingModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  previousCheckIns,
  previousCheckOuts,
  onBookingSuccess,
}: BookingModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: createNewBooking, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!values.checkIn || !values.checkOut) {
        throw new Error("Both check-in and check-out dates are required.")
      }
      return createBooking(propertyId, values.checkIn.toISOString(), values.checkOut.toISOString(), 100)
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed! 🎉",
        description: "Your stay has been successfully booked.",
      })
      form.reset()
      onClose()
      onBookingSuccess()
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.checkIn || !values.checkOut) {
      toast({
        title: "Missing Dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    if (values.checkOut < values.checkIn) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      })
      return
    }

    createNewBooking(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Book Your Stay</DialogTitle>
          <DialogDescription className="text-base">{propertyTitle}</DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 pt-2">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base">Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal h-11",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "EEE, MMM d, yyyy") : <span>Select date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3 border-b">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>Unavailable dates are shown in red</span>
                          </div>
                        </div>
                        <Calendar
                          mode="single"
                          disabled={(date) =>
                            date < new Date() ||
                            date < new Date("1900-01-01") ||
                            previousCheckIns.some((testDate) => isSameDay(testDate, date))
                          }
                          selected={field.value ?? undefined}
                          modifiers={{ booked: previousCheckIns }}
                          modifiersClassNames={{
                            booked: "bg-destructive/15 text-destructive font-medium hover:bg-destructive/25",
                          }}
                          onSelect={field.onChange}
                          className="rounded-md border shadow-none"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base">Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal h-11",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "EEE, MMM d, yyyy") : <span>Select date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3 border-b">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>Select a date after check-in</span>
                          </div>
                        </div>
                        <Calendar
                          mode="single"
                          disabled={(date) => {
                            const checkIn = form.getValues("checkIn")
                            return (
                              date < new Date() ||
                              date < new Date("1900-01-01") ||
                              (checkIn && date <= checkIn) ||
                              previousCheckOuts.some((testDate) => isSameDay(testDate, date))
                            )
                          }}
                          selected={field.value ?? undefined}
                          modifiers={{ booked: previousCheckOuts }}
                          modifiersClassNames={{
                            booked: "bg-destructive/15 text-destructive font-medium hover:bg-destructive/25",
                          }}
                          onSelect={field.onChange}
                          className="rounded-md border shadow-none"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Booking...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

