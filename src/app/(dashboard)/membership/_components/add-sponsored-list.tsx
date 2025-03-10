"use client";

import type React from "react";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SponsoredListingFormData {
  planTitle: string;
  description: string;
  price: number;
  numberOfListing: number;
}

export default function AddSponsoredListing({
  setShowSponsoredListing,
}: {
  setShowSponsoredListing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [formData, setFormData] = useState<SponsoredListingFormData>({
    planTitle: "",
    description: "",
    price: 0,
    numberOfListing: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "numberOfListing" ? Number(value) : value,
    }));
  };

  const createSponsoredListingMutation = useMutation({
    mutationFn: async (data: SponsoredListingFormData) => {
      // Prepare headers with authentication token from session
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if session token exists
      if (session?.user?.token) {
        headers.Authorization = `Bearer ${session.user.token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sponsoredlisting/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create sponsored listing"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Sponsored listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ["sponsoredListings"] });
      setShowSponsoredListing(false);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
      console.error("Sponsored listing creation error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.planTitle) {
      toast.error("Plan title is required");
      return;
    }

    if (!formData.description) {
      toast.error("Description is required");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (formData.numberOfListing <= 0) {
      toast.error("Number of listings must be greater than 0");
      return;
    }

    // Check if user is authenticated
    if (!session?.user?.token) {
      toast.error("You must be logged in to create a sponsored listing");
      return;
    }

    setIsLoading(true);
    try {
      await createSponsoredListingMutation.mutateAsync(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="rounded-t-3xl bg-primary px-[32px] py-4">
        <h1 className="text-[28px] font-semibold text-white">
          Add Sponsored Listing
        </h1>
      </div>
      <div className="mt-4">
        <CardContent className="p-6">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="planTitle">Plan Title *</Label>
                  <Input
                    className="h-[50px] mt-2"
                    id="planTitle"
                    name="planTitle"
                    type="text"
                    required
                    value={formData.planTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. 1 Sponsored Listing"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="mt-2 min-h-[100px]"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g. Get 1 Sponsored listing at 20$"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    className="h-[50px] mt-2"
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfListing">Number of Listings *</Label>
                  <Input
                    className="h-[50px] mt-2"
                    id="numberOfListing"
                    name="numberOfListing"
                    type="number"
                    min="1"
                    required
                    value={formData.numberOfListing || ""}
                    onChange={handleInputChange}
                    placeholder="1"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSponsoredListing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Sponsored Listing"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
