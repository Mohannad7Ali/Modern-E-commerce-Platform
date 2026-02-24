import { Product } from '@/types/productTypes'
import React from 'react'
interface ProductCardProps {
  product: Product
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return <div>ProductCard</div>
}

export default ProductCard
