import { Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 ml-4">
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
            <div className="flex items-center gap-4">
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
              Dashboard
            </Link>
            <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
