'use client'
import sliderData from '@/lib/constants/sliderData'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, ShoppingBag, Star } from 'lucide-react'
import Link from 'next/link'
interface HeroSectionProps {
  isPreview?: boolean
}

const HeroSection = ({ isPreview = false }: HeroSectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  useEffect(() => {
    if (!isPreview) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev === sliderData.length - 1 ? 0 : prev + 1))
      }, 7000)
      return () => clearInterval(interval)
    }
  }, [isPreview, sliderData.length])
  const nextSlide = () => {
    setCurrentImageIndex(prev => (prev === sliderData.length - 1 ? 0 : prev + 1))
  }
  const prevSlide = () => {
    setCurrentImageIndex(prev => (prev === 0 ? sliderData.length - 1 : prev - 1))
  }
  const gotoSlide = (index: number) => {
    setCurrentImageIndex(index)
  }
  const currentSlide = sliderData[currentImageIndex]
  return (
    <section className={`relative w-full ${isPreview ? 'my-2 scale-90' : 'my-2 sm:my-4 lg:my-6'}`}>
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        {/* Hero Image Slider */}
        <div className="relative w-full">
          <div className="relative aspect-[12/16] w-full sm:aspect-[16/7] lg:aspect-[16/6]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1, x: 100, y: 100, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: -100,
                  y: -100,
                  rotate: -10,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-white backdrop-blur-sm sm:mb-6 sm:gap-2 sm:px-4 sm:py-2"
                      >
                        <Star size={16} className="text-yellow-400" />
                        <span className="text-xs font-medium sm:text-sm">{currentSlide.badge}</span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-3 text-2xl leading-tight font-bold text-white sm:mb-4 sm:text-3xl lg:text-4xl xl:text-6xl"
                      >
                        {currentSlide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6 max-w-lg text-base text-white/90 sm:mb-8 sm:text-lg lg:text-xl"
                      >
                        {currentSlide.subtitle}
                      </motion.p>

                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          href={currentSlide.ctaLink}
                          className="inline-flex transform items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
                        >
                          <ShoppingBag size={16} className="sm:h-5 sm:w-5" />
                          {currentSlide.ctaText}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:left-4 sm:flex sm:p-3"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:right-4 sm:flex sm:p-3"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="sm:h-6 sm:w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => gotoSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${
                index === currentImageIndex ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          className="absolute top-2 right-2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:top-4 sm:right-4 sm:p-2"
          aria-label="Play/Pause slideshow"
        >
          <Play size={16} className="sm:h-5 sm:w-5" />
        </button>
      </div>
    </section>
  )
}
export default HeroSection
