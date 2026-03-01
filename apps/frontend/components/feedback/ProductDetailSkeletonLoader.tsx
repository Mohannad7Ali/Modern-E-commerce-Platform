import React from 'react'
import { motion } from 'framer-motion'

const ProductDetailSkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-gray-200"></div>
          </motion.div>

          {/* Product Info Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Price */}
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200"></div>
              </div>

              {/* Variant Options */}
              <div className="space-y-4">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="flex flex-wrap gap-2">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
                    ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Reviews Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-2 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default React.memo(ProductDetailSkeletonLoader)
