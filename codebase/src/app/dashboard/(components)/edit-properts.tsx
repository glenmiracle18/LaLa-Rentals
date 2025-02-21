import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Property } from "@prisma/client";
import { deleteProperty, updateProperty } from "@/(actions)/listing";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onEditComplete: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  onClose,
  onEditComplete,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    visitingHours: property.visitingHours,
    hostId: property.hostId,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onEditComplete();
      onClose();
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Property & { id: string }) => {
      return updateProperty(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onEditComplete();
      onClose();
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updatePropertyMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "bedrooms" || name === "bathrooms"
          ? parseInt(value, 10)
          : value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Property: {property.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price/month</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitingHours">Visiting Hours</Label>
            {/* <Input
              id="visitingHours"
              name="visitingHours"
              value={formData.visitingHours}
              onChange={handleChange}
              required
            /> */}
            <Select
              onValueChange={() => handleChange}
              defaultValue={formData.visitingHours}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visiting hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9 AM - 12 PM">9 AM - 12 PM</SelectItem>
                <SelectItem value="1 PM - 5 PM">1 PM - 5 PM</SelectItem>
                <SelectItem value="6 PM - 8 PM">6 PM - 8 PM</SelectItem>
                <SelectItem value="Weekends 10 AM - 4 PM">
                  Weekends 10 AM - 4 PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updatePropertyMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updatePropertyMutation.isPending}>
              {updatePropertyMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <Button
          type="button"
          variant="destructive"
          onClick={() => deletePropertyMutation.mutate(property.id)}
          disabled={deletePropertyMutation.isPending}
        >
          {deletePropertyMutation.isPending ? "Deleting..." : "Delete Property"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
