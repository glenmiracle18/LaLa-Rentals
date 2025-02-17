"use client"
import { createListing } from "@/(actions)/listing";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CreateListingData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  visitingHours: z.object({
    from: z.string(),
    to: z.string(),
  }),
  price: z.number().positive(),
  bedrooms: z.number().positive(),
  bathrooms: z.number().positive(),
  description: z.string().min(10).max(500),
  images: z.array(z.string()),
});

const CreateListingForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      visitingHours: {
        from: "",
        to: "",
      },
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      description: "",
      images: [],
    },
  });

  const { mutate: createProperty, isPending } = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Property listing created successfully",
      });
      console.log(data);
      reset();
      setUploaded(false);
      setUploadedImages([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { handleSubmit, control, reset } = form;
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const listingData: CreateListingData = {
      name: data.name,
      location: data.location,
      description: data.description,
      price: Number(data.price),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      visitingHours: {
        from: data.visitingHours.from,
        to: data.visitingHours.to,
      },
      images: uploadedImages,
    };
    console.log("Success: ", listingData);

    createProperty(listingData);
    reset();
  };

  const hoursOfWeek = [
    { label: "00:00", value: "00:00" },
    { label: "01:00", value: "01:00" },
    { label: "02:00", value: "02:00" },
    { label: "03:00", value: "03:00" },
    { label: "04:00", value: "04:00" },
    { label: "05:00", value: "05:00" },
    { label: "06:00", value: "06:00" },
    { label: "07:00", value: "07:00" },
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
    { label: "13:00", value: "13:00" },
    { label: "14:00", value: "14:00" },
    { label: "15:00", value: "15:00" },
    { label: "16:00", value: "16:00" },
    { label: "17:00", value: "17:00" },
    { label: "18:00", value: "18:00" },
    { label: "19:00", value: "19:00" },
    { label: "20:00", value: "20:00" },
    { label: "21:00", value: "21:00" },
    { label: "22:00", value: "22:00" },
    { label: "23:00", value: "23:00" },
  ];

  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Name</FormLabel>
            <FormControl>
              <Input placeholder="enter property name" />
            </FormControl>
          </FormItem>
        )}
      />

      
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
};

export default CreateListingForm;
