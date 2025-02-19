"use client"

import React, { useState } from 'react';
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const SignUpPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/listing"
          unsafeMetadata={{
            role: selectedRole,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>
            Select how you want to use LaLa Rentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            className="gap-6"
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="RENTER" id="renter" />
              <Label htmlFor="renter">
                <div className="grid gap-1.5">
                  <h3 className="font-semibold">Renter</h3>
                  <p className="text-sm text-gray-500">
                    I want to book properties and find places to stay
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="HOST" id="host" />
              <Label htmlFor="host">
                <div className="grid gap-1.5">
                  <h3 className="font-semibold">Host</h3>
                  <p className="text-sm text-gray-500">
                    I want to list my properties and host guests
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            className="w-full mt-6"
            disabled={!selectedRole}
            onClick={() => setShowSignUp(true)}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;