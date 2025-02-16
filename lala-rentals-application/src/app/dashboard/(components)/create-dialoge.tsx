import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Upload,
  Home,
  MapPin,
  Clock,
  DollarSign,
  Bed,
  Bath,
  FileText,
  X,
} from "lucide-react";
import { format, set } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/utils/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { createListing } from "@/(actions)/listing";
import { CreateListingData } from "@/types";


type FormData = {
  name: string;
  location: string;
  visitingDays: {
    from: Date;
    to: Date;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
};

export default function PropertyListingForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      visitingDays: {
        from: undefined,
        to: undefined,
      }
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const [ uploaded, setUploaded ] = useState<boolean>(false);
  const [ uploadedImages, setUploadedImages ] = useState<string[]>([]);

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // mutation
  const { mutate: createProperty, isPending } = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Property listing created successfully",
      });
      console.log(data)
      reset();
      setUploaded(false);
      setUploadedImages([]);
      handleDialogOpen();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const handleDialogOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // validation
  const validateForm = (data: FormData) => {
    if (!uploadedImages.length) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return false;
    }
    
    if (!data.visitingDays.from || !data.visitingDays.to) {
      toast({
        title: "Error",
        description: "Please select visiting days",
        variant: "destructive",
      });
      return false;
    }
  
    return true;
  };
  
  const onSubmit = (data: FormData) => {
    if(!validateForm(data)) return;
    const listingData: CreateListingData = {
      name: data.name,
      location: data.location,
      description: data.description,
      price: Number(data.price),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      visitingDays: {
        from: data.visitingDays.from, // Convert Date to string
        to: data.visitingDays.to, 
      },
      images: uploadedImages,
    };
    console.log("Success: ", listingData);
  
    createProperty(listingData);
  };


  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Property Listing</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new property listing. Click
            save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="w-full h-[250px]">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                setUploaded(true)
                const newImages = res.map((file) => file.ufsUrl)
                setUploadedImages((prev) => [...prev, ...newImages])
                toast({
                  title: "🚀 Upload Complete",
                })
              }}
             
              onUploadError={(error: Error) => {
                setUploaded(false)
                console.log("Error: ", error);
                toast({
                  title: "🚀 Upload Error",
                  description: error.message
                })
              }}
              onUploadBegin={(name) => {
                // Do something once upload begins
                console.log("Uploading: ", name);
                toast({title: "🚀 Uploading: ", description: `${name}`}) ;
              }}
              onChange={(acceptedFiles) => {
                // Do something with the accepted files
                setFiles(acceptedFiles);
                console.log("Accepted files: ", acceptedFiles);
              }}
            />

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
                    {...register("name", {
                      required: "Property name is required",
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter property location"
                    className="pl-8"
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Visiting Days</Label>
              <div className="flex space-x-2">
                <Controller
                  name="visitingDays.from"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name="visitingDays.to"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>To date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {(errors.visitingDays?.from || errors.visitingDays?.to) && (
                <p className="text-sm text-red-500">
                  Both start and end dates are required
                </p>
              )}
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
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
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
                {errors.bedrooms && (
                  <p className="text-sm text-red-500">
                    {errors.bedrooms.message}
                  </p>
                )}
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
                {errors.bathrooms && (
                  <p className="text-sm text-red-500">
                    {errors.bathrooms.message}
                  </p>
                )}
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
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter className="flex items-end">
        <Button 
          type="submit" 
          onClick={handleSubmit(onSubmit)} 
          disabled={!uploaded || isPending}
        >
          {isPending ? "Creating..." : "Save Property Listing"}
        </Button>
        {!uploaded && (
          <p className="text-orange-400 text-sm font-serif">
            Upload an image to complete property listing
          </p>
        )}
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
