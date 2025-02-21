"use client"
import { Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

type roleProps = "RENTER" | "HOST"

const Header = () => {
  const { user } = useUser()
  const role: roleProps = user?.unsafeMetadata.role as roleProps


  return (
    <header className="sticky top-0 z-50 w-screen border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 ml-14 font-mono">
          <Home className="h-6 w-6" />
          <span className="font-bold">LaLa Rentals</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/listings"
          >
            Listings
          </Link>
        </nav>
        <div className="ml-4">
          <SignedOut>
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
              Sign In
            </Link>
            <Link href="/sign-up" className={buttonVariants({ variant: "default" })}>
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            { role === "RENTER" ? (
              <div className="flex items-center gap-4">
                <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                  About
                </Link>
                <UserButton />
              </div>
            ): (
            <div className="flex items-center gap-4">
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
              Dashboard
            </Link>
            <UserButton />
            </div>
            )}
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
