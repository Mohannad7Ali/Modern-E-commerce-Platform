import React from 'react'
import { Product } from '@/types/productTypes'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
interface ProductSectionProps {
  title: string
  products: Product[]
  loading: boolean
  error: undefined
  showTitle?: boolean
}
const ProductSection: React.FC<ProductSectionProps> = ({ title, products, error, showTitle = false }) => {
  if (error) {
    return <section className="py-8 sm:py-12 lg:py-16"></section>
  }
  if (!products.length) {
    return <section className="py-8 sm:py-12 lg:py-16">No products available</section>
  }
  return <section className="py-8 sm:py-12 lg:py-16"></section>
}

export default ProductSection
