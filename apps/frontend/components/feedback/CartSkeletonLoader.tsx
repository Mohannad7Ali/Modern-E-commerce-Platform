import React from 'react'
import { motion } from 'framer-motion'

const CartSkeletonLoader: React.FC = () => {
  const skeletonItems = Array(3).fill(0) // Show 3 skeleton cart items

  return (
    <div className="space-y-4">
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex flex-col items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-6"
        >
          {/* Product Image Skeleton */}
          <div className="h-16 w-16 animate-pulse rounded bg-gray-200 sm:h-20 sm:w-20"></div>

          {/* Product Details Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Quantity Selector Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-12 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
          </div>

          {/* Price and Remove Button Skeleton */}
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default React.memo(CartSkeletonLoader)
