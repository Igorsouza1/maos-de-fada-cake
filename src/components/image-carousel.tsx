"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: { src: string; alt: string; description: string; name: string; price: number }[]
  onImageChange: (image: { description: string; name: string; price: number }) => void
}

export function ImageCarousel({ images, onImageChange }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    onImageChange({
      description: images[newIndex].description,
      name: images[newIndex].name,
      price: images[newIndex].price,
    })
  }

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    onImageChange({
      description: images[newIndex].description,
      name: images[newIndex].name,
      price: images[newIndex].price,
    })
  }

  return (
    <div className="relative h-80 w-full">
      <Image
        src={images[currentIndex].src || "/placeholder.svg"}
        alt={images[currentIndex].alt}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-110"
      />
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

