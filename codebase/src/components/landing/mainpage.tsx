import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search } from 'lucide-react'

const MainPage = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Perfect Rental Home
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover a wide range of properties tailored to your needs. Start your journey to the perfect home
                  today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="flex-1" placeholder="Enter a city or ZIP code" type="text" />
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
  )
}

export default MainPage
