'use client'
import BreadCrumb from '@/components/feedback/BreadCrumb'
import MainLayout from '@/components/templates/MainLayout'
import { Trash2, ShoppingCart } from 'lucide-react'
import React, { useMemo } from 'react'
import Image from 'next/image'
import { Controller, useForm } from 'react-hook-form'
// import CartSummary from '@/(public)/cart/CartSummary'
import { useGetCartQuery, useRemoveFromCartMutation } from '@/store/apis/CartApi'
// import QuantitySelector from '@/components/molecules/QuantitySelector'
import { motion } from 'framer-motion'
// import CartSkeletonLoader from '@/components/feedback/CartSkeletonLoader'
import { generateProductPlaceholder } from '@/utils/placeholderImage'

// Helper function to format variant name from SKU
const formatVariantName = (item: any) => {
  const { name } = item.variant.product
  const sku = item.variant.sku
  // Parse SKU (e.g., "TSH-RED-M" -> "Red, Medium")
  const parts = sku.split('-').slice(1) // Remove prefix (e.g., "TSH")
  const variantDetails = parts.join(', ') // Join color and size
  return `${name} - ${variantDetails}`
}
const Cart = () => {}
export default Cart
