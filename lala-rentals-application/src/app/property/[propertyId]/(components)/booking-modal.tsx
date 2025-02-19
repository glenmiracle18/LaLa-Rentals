import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { createBooking } from "@/(actions)/booking";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  checkIn: z.date({
    required_error: "Check-in date is required.",
  }).nullish(),
  checkOut: z.date({
    required_error: "Check-out date is required.",
  }).nullish(),
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  previousCheckIns: Date[];
  previousCheckOuts: Date[];
  onBookingSuccess: () => void;
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
  });

  console.log(previousCheckIns);
  console.log(previousCheckOuts);

  const { mutate: createNewBooking, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!values.checkIn || !values.checkOut) {
        throw new Error("Both check-in and check-out dates are required.");
      }
      return createBooking(
        propertyId,
        values.checkIn.toISOString(),
        values.checkOut.toISOString(),
        100
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Successfully booked the property",
      })
      form.reset();
      onClose();
      onBookingSuccess();

    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isPending) {
    toast({
      title: "Booking Property...",
      description: "Please wait while we book the property for you",
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createNewBooking(values);
    console.log("success");
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        selected={field.value ? field.value : undefined}
                        modifiers={{ previousCheckIns }}
                        modifiersClassNames={{ previousCheckIns: "bg-red-400/30 opacity-50" }}
                        onSelect={(date) => {
                          if (date && previousCheckIns.some(testDate => isSameDay(testDate, date))) {
                            toast({
                              title: "Error",
                              description: "This date is already booked",
                              variant: "destructive",
                            });
                          } else {
                            field.onChange(date);
                          }
                        }}
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
                  <FormLabel>Check-out Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? field.value : undefined}
                        modifiers={{ previousCheckOuts }}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        modifiersClassNames={{ previousCheckOuts: "bg-red-400/30 opacity-50" }}
                        onSelect={(date) => {
                          if (date && previousCheckOuts.some(testDate => isSameDay(testDate, date))) {
                            toast({
                              title: "Error",
                              description: "This date is already booked",
                              variant: "destructive",
                            });
                          } else {
                            field.onChange(date);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Booking Property..." : "Book Now"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
