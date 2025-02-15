"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Upload, Home, MapPin, Clock, DollarSign, Bed, Bath, FileText } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type FormData = {
  name: string
  location: string
  visitingHours: {
    from: Date | undefined
    to: Date | undefined
  }
  availability: string
  price: string
  bedrooms: string
  bathrooms: string
  description: string
}

export default function PropertyListingForm() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    toast({
      title: "Property Listing Created",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Property Listing</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new property listing. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Property Image</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/70"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Property Name</Label>
                <div className="relative">
                  <Home className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter property name"
                    className="pl-8"
                    {...register("name", { required: "Property name is required" })}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter property location"
                    className="pl-8"
                    {...register("location", { required: "Location is required" })}
                  />
                </div>
                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Visiting Hours</Label>
              <div className="flex space-x-2">
                <Controller
                  name="visitingHours.from"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>From date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name="visitingHours.to"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>To date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {(errors.visitingHours?.from || errors.visitingHours?.to) && (
                <p className="text-sm text-red-500">Both start and end dates are required</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Controller
                name="availability"
                control={control}
                rules={{ required: "Availability is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.availability && <p className="text-sm text-red-500">{errors.availability.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  placeholder="Enter price"
                  type="number"
                  className="pl-8"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                />
              </div>
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-1.5 flex-1">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <div className="relative">
                  <Bed className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bedrooms"
                    placeholder="Number of bedrooms"
                    type="number"
                    className="pl-8"
                    {...register("bedrooms", {
                      required: "Number of bedrooms is required",
                      min: { value: 0, message: "Must be 0 or more" },
                    })}
                  />
                </div>
                {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5 flex-1">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <div className="relative">
                  <Bath className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bathrooms"
                    placeholder="Number of bathrooms"
                    type="number"
                    className="pl-8"
                    {...register("bathrooms", {
                      required: "Number of bathrooms is required",
                      min: { value: 0, message: "Must be 0 or more" },
                    })}
                  />
                </div>
                {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms.message}</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                placeholder="Enter property description"
                className="pl-8"
                {...register("description", { required: "Description is required" })}
              />
            </div>
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Save Property Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

