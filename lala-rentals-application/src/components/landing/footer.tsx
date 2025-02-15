import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 RentEase. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Privacy Policy
              </Link>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </footer>
  )
}

export default Footer
