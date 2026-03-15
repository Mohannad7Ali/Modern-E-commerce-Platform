'use client'
import { useInitiateCheckoutMutation } from '@/store/apis/CheckoutApi'
import React, { useMemo } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import useToast from '@/hooks/ui/useToast'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const stripePromise = loadStripe(
  'pk_test_51R9gs72KGvEXtMtXXTm7UscmmHYsvk9j3ktaM8vxRb3evNJgG1dpD05YWACweIfcPtpCgOIs4HkpGrTCKE1dZD0p00sLC6iIBg',
)

interface CartSummaryProps {
  subtotal: number
  shippingRate?: number
  currency?: string
  totalItems: number
  cartId: string
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shippingRate = 0.01, currency = '$', totalItems }) => {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [initiateCheckout, { isLoading }] = useInitiateCheckoutMutation()

  const shippingFee = useMemo(() => subtotal * shippingRate, [subtotal, shippingRate])
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee])

  const handleInitiateCheckout = async () => {
    try {
      // 2. الحصول على sessionId من السيرفر أولاً
      const res = await initiateCheckout(undefined).unwrap()

      // 3. انتظار تحميل Stripe والتأكد من وجوده
      const stripe: Stripe | null = await stripePromise

      if (!stripe) {
        showToast('فشل تحميل نظام الدفع، يرجى المحاولة لاحقاً', 'error')
        return
      }

      const { error } = await (stripe as any).redirectToCheckout({
        sessionId: res.sessionId,
      })

      if (error) {
        showToast(error.message || 'حدث خطأ أثناء التوجيه للدفع', 'error')
      }
    } catch (err) {
      showToast('فشل بدء عملية الدفع', 'error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8"
    >
      {/* ... باقي كود الـ JSX يظل كما هو دون تغيير ... */}
      <h2 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">Order Summary</h2>
      {/* ... */}

      {isAuthenticated ? (
        <button
          disabled={isLoading || totalItems === 0}
          onClick={handleInitiateCheckout}
          className="mt-4 w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      ) : (
        <Link
          href="/sign-in"
          className="mt-4 inline-block w-full rounded-md bg-gray-300 py-2.5 text-center text-sm font-medium text-gray-800 transition-colors hover:bg-gray-400"
        >
          Sign in to Checkout
        </Link>
      )}
    </motion.div>
  )
}

export default CartSummary
