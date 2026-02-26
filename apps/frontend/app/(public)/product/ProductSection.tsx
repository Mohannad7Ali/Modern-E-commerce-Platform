import React from 'react'
import { Product } from '@/types/productTypes'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Package } from 'lucide-react'
import { GetFlaggedProductsQuery } from '@/gql/generated/graphql'
type QueryProduct = GetFlaggedProductsQuery['products']['products'][0]
interface ProductSectionProps {
  title: string
  products: Product[] | QueryProduct[]
  loading: boolean
  error: Error | undefined
  showTitle?: boolean
}
const ProductSection: React.FC<ProductSectionProps> = ({ title, products, error, showTitle = false }) => {
  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No {title.toLowerCase()} available</h3>
              <p className="text-sm text-gray-600">Check back soon for new products!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  if (!products.length) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No {title.toLowerCase()} available</h3>
              <p className="text-sm text-gray-600">Check back soon for new products!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 capitalize sm:text-[22px]">{title}</h2>
              {products.length > 8 && (
                <button className="inline-flex items-center gap-2 self-start rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white sm:self-auto sm:px-6 sm:py-3">
                  View All
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3">
          {products.map(product => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection
