"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from "react-dropzone"
import { Plus, X } from "lucide-react"
import { useUploadThing } from "@/utils/uploadthing"
import { createListing } from "@/(actions)/listing"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().min(1, {
    message: "Price must be at least 1 character.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Bathrooms must be a valid number.",
  }),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Bedrooms must be a valid number.",
  }),
  visitingHours: z.string({
    required_error: "Please select visiting hours.",
  }),
  images: z.array(z.instanceof(File)).min(1, {
    message: "Please select at least one image.",
  }),
})

export function CreatePropertyListingModal() {
  const [open, setOpen] = useState(false)
  const [isUploading] = useState(false)
  const { startUpload } = useUploadThing("imageUploader")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      address: "",
      visitingHours: "",
      images: [],
    },
  })

  const { setValue, watch } = form
  const images = watch("images")

  const onDrop = (acceptedFiles: File[]) => {
    setValue("images", acceptedFiles, { shouldValidate: true })
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  })

  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    )
  }

  const { mutate: createProperty, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const uploadedImages = await startUpload(values.images)
      if (!uploadedImages) throw new Error("Failed to upload images")

      const imageUrls = uploadedImages.map((image) => image.ufsUrl)

      return createListing({
        title: values.title,
        description: values.description,
        price: values.price,
        address: values.address,
        bathrooms: Number(values.bathrooms),
        bedrooms: Number(values.bedrooms),
        visitingHours: values.visitingHours,
        images: imageUrls,
      })
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property created successfully",
      })
      setOpen(false)
      form.reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createProperty(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="h-14 px-6 text-md font-semibold font-mono"
        >
                <Plus className="mr-2 h-6 w-6" />

          Create Property Listing
        </Button>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Property Listing</DialogTitle>
          <DialogDescription>Fill in the details for your new property listing.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Cozy apartment in the city center" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A beautiful apartment with modern amenities..."
                          {...field}
                          className="w-full h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="1000" {...field} className="w-full" />
                      </FormControl>
                      <FormDescription>Price per month in USD</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State, ZIP" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input placeholder="4" {...field} type="number" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input placeholder="2" {...field} type="number" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visitingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visiting Hours</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select visiting hours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9 AM - 12 PM">9 AM - 12 PM</SelectItem>
                          <SelectItem value="1 PM - 5 PM">1 PM - 5 PM</SelectItem>
                          <SelectItem value="6 PM - 8 PM">6 PM - 8 PM</SelectItem>
                          <SelectItem value="Weekends 10 AM - 4 PM">Weekends 10 AM - 4 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <div>
                          <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            <input {...getInputProps()} />
                            <p>Drag&apos;n&apos;drop some images here, or click to select images</p>
                          </div>
                          {images.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {images.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={`preview ${index}`}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Upload up to 5 images of your property</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isUploading || isPending} className="w-full sm:w-auto">
                {isPending ? "Creating..." : "Create Listing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

