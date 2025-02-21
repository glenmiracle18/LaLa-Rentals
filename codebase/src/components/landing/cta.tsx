import React from 'react'
import { Button } from '../ui/button'

const CallToAction = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Find Your Perfect Rental?</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Join thousands of happy renters who found their home with RentEase.
              </p>
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
  )
}

export default CallToAction
