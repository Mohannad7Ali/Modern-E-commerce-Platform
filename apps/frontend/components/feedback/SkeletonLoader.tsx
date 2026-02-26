import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader: React.FC = () => {
  const skeletonItems = Array(10).fill(0) // Adjust number of skeleton items as needed

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
        {skeletonItems.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="aspect-[3/4] animate-pulse bg-gray-200"></div>
            <div className="p-4">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default React.memo(SkeletonLoader)
