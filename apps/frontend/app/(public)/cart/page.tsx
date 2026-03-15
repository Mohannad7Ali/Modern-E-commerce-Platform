'use client'
import BreadCrumb from '@/components/feedback/BreadCrumb'
import MainLayout from '@/components/templates/MainLayout'
import { Trash2, ShoppingCart } from 'lucide-react'
import React, { useMemo } from 'react'
import Image from 'next/image'
import CartSkeletonLoader from '@/components/feedback/CartSkeletonLoader'
import CartSummary from '@/app/(public)/cart/CartSummary'

import { Controller, useForm } from 'react-hook-form'
// import CartSummary from '@/(public)/cart/CartSummary'
import { useGetCartQuery, useRemoveFromCartMutation } from '@/store/apis/CartApi'
// import QuantitySelector from '@/components/molecules/QuantitySelector'
import { motion } from 'framer-motion'
// import CartSkeletonLoader from '@/components/feedback/CartSkeletonLoader'
import { generateProductPlaceholder } from '@/utils/placeholderImage'
import QuantitySelector from '@/components/molecules/QuantitySelector'

// Helper function to format variant name from SKU
const formatVariantName = (item: any) => {
  const { name } = item.variant.product
  const sku = item.variant.sku
  // Parse SKU (e.g., "TSH-RED-M" -> "Red, Medium")
  const parts = sku.split('-').slice(1) // Remove prefix (e.g., "TSH")
  const variantDetails = parts.join(', ') // Join color and size
  return `${name} - ${variantDetails}`
}
const Cart = () => {
  const { control } = useForm()
  const { data, isLoading } = useGetCartQuery({})
  const [removeFromCart] = useRemoveFromCartMutation()
  const cartItems = data?.cart?.cartItems || []
  console.log('items => ', cartItems)

  const subtotal = useMemo(() => {
    if (!cartItems.length) return 0
    return cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  }, [cartItems])
  console.log('subtotal => ', subtotal)

  const handleRemoveFromCart = async id => {
    try {
      await removeFromCart(id).unwrap()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <BreadCrumb />

      {/* Cart Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 mb-6 flex items-center space-x-2"
      >
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">Your Cart</h1>
        <span className="text-sm text-gray-500">({cartItems.length} items)</span>
      </motion.div>

      {/* Cart Content */}
      {isLoading ? (
        <CartSkeletonLoader />
      ) : cartItems.length === 0 ? (
        <div className="py-10 text-center">
          <ShoppingCart size={40} className="mx-auto mb-3 text-gray-400" />
          <p className="text-base text-gray-600 sm:text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-6"
              >
                {/* Product Image */}
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-gray-50 sm:h-20 sm:w-20">
                  <Image
                    src={item?.variant?.images[0] || generateProductPlaceholder(item.variant.product.name)}
                    alt={formatVariantName(item)}
                    width={80}
                    height={80}
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, 80px"
                    onError={e => {
                      e.currentTarget.src = generateProductPlaceholder(item.variant.product.name)
                    }}
                  />
                </div>

                {/* Variant Details */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 sm:text-base">{formatVariantName(item)}</p>
                  <p className="text-xs text-gray-500 sm:text-sm">${item.variant.price.toFixed(2)}</p>
                </div>

                {/* Quantity Selector */}
                <Controller
                  name={`quantity-${item.variant.id}`}
                  defaultValue={item.quantity}
                  control={control}
                  render={({ field }) => (
                    <QuantitySelector itemId={item.id} value={field.value} onChange={field.onChange} />
                  )}
                />

                {/* Subtotal and Remove */}
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <p className="text-sm font-medium text-gray-800 sm:text-base">
                    ${(item.variant.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <CartSummary subtotal={subtotal} totalItems={cartItems.length} cartId={data?.cart?.id} />
        </div>
      )}
    </div>
  )
}

export default Cart
