import { Search, Star, Users } from 'lucide-react'
import React from 'react'
import { Card, CardTitle } from '../ui/card'

const Reasons = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose RentEase?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Easy Search",
                  description: "Find your ideal rental with our powerful search tools.",
                },
                {
                  icon: Users,
                  title: "Verified Listings",
                  description: "All our properties are verified for your peace of mind.",
                },
                {
                  icon: Star,
                  title: "Top-Rated Support",
                  description: "Our customer support team is here to help 24/7.",
                },
              ].map((item, i) => (
                <Card key={i} className="flex flex-col items-center text-center p-6">
                  <item.icon className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
  )
}

export default Reasons
