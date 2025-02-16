"use client"
import Image from "next/image"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MapPin, Star, Users, Search } from "lucide-react"
import Header from "@/components/landing/header"
import MainPage from "@/components/landing/mainpage"
import FeaturedProperties from "@/components/landing/featured-properties"
import Reasons from "@/components/landing/reasons"
import Testimonials from "@/components/landing/testimonials"
import CallToAction from "@/components/landing/cta"
import Footer from "@/components/landing/footer"

export default function PropertyRentalLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <MainPage />

        <FeaturedProperties />

        <Reasons />

       <Testimonials />

        <CallToAction />
      </main>

      <Footer />
    </div>
  )
}

