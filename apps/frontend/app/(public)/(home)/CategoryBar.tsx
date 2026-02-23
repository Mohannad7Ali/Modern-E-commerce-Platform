'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useGetAllCategoriesQuery } from '@/store/apis/CategoryApi'
import {
  Smartphone,
  Monitor,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Laptop,
  Tablet,
  Speaker,
  Keyboard,
  Mouse,
  Printer,
  Router,
  HardDrive,
  MemoryStick,
  Cpu,
  MonitorSmartphone,
  SmartphoneCharging,
  Wifi,
  Bluetooth,
  Package,
} from 'lucide-react'

// Category icon mapping for fallback
import { categoryIcons } from '@/lib/constants/categoryIcons'
import { retry } from '@reduxjs/toolkit/query'
// Default icon for categories without specific mapping
const DefaultIcon = Package

const CategoryBar = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({})
  const categories = data?.categories || []
  // Get icon for category (fallback)
  function getCategoryIcon(categoryName: string) {
    const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '')
    // try exact match first
    if (categoryIcons[normalizedName]) {
      return categoryIcons[normalizedName]
    }
    // Try partial matches
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return icon
      }
    }
    return DefaultIcon
  }
  if (isLoading) {
    return (
      <section className="pt-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="shrink-0"
              >
                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="mt-2 h-3 w-12 animate-pulse rounded bg-gray-200" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  if (error || !categories.length) {
    return null
  }
  return (
    <section className="pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-left"
        >
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Shop by Category</h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category: any, index: number) => {
            const hasImages = category.images && categories.length > 0
            const imageSrc = hasImages ? category.images[0] : null
            const Icon = getCategoryIcon(category.name)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group"
              >
                <Link className="block" href={`/shop/categoryId=${category.id}`}>
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 hover:border-indigo-200 hover:shadow-lg">
                    {/* Image or Icon */}
                    <div className="relative mb-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 group-hover:shadow-lg"
                      >
                        {hasImages && imageSrc ? (
                          <>
                            <Image
                              src={imageSrc}
                              alt={category.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                          </>
                        ) : (
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 transition-all duration-300 group-hover:shadow-lg"
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      {/* Hover effect */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-1 -right-1 z-10 h-4 w-4 rounded-full border-2 border-white bg-green-500"
                      />
                    </div>

                    {/* Category name */}
                    <div className="text-center">
                      <h3 className="truncate text-sm font-semibold text-gray-800 transition-colors duration-300 group-hover:text-indigo-700">
                        {category.name}
                      </h3>

                      {/* Product count (if available) */}
                      {category.products && (
                        <p className="mt-1 text-xs text-gray-500">{category.products.length} products</p>
                      )}
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex transform items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl"
          >
            <span>View All Categories</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              →
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
export default CategoryBar
