import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Alex Johnson",
                  comment: "RentEase made finding my dream apartment a breeze. Highly recommended!",
                },
                {
                  name: "Sarah Lee",
                  comment: "The verified listings gave me peace of mind. Great platform for renters!",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="flex flex-col justify-between">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  </CardContent>
                  <CardFooter>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
  )
}

export default Testimonials
