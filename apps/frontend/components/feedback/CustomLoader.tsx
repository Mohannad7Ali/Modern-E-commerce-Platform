'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Truck, Zap } from 'lucide-react'

const CustomLoader = () => {
  const loadingSteps = [
    { icon: ShoppingBag, text: 'Preparing your experience', delay: 0 },
    { icon: Package, text: 'Loading products', delay: 1 },
    { icon: Truck, text: 'Setting up delivery', delay: 2 },
    { icon: Zap, text: 'Almost ready', delay: 3 },
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-20 left-20 h-32 w-32 rounded-full bg-indigo-300"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5,
          }}
          className="absolute right-20 bottom-20 h-24 w-24 rounded-full bg-purple-300"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1,
          }}
          className="absolute top-1/2 left-10 h-16 w-16 rounded-full bg-blue-300"
        />
      </div>

      {/* Main loading content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
          }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-indigo-500 opacity-20"
            />
            <div className="relative inline-block rounded-full border border-indigo-100 bg-white p-6 shadow-lg">
              <span className="text-3xl font-bold text-indigo-600">Horizon</span>
            </div>
          </div>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mx-auto h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 mx-auto h-16 w-16 rounded-full border-4 border-indigo-100"
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Welcome to Horizon ECommerce</h2>
          <p className="text-gray-600">We&apos;re getting everything ready for you</p>
        </motion.div>

        {/* Loading steps */}
        <div className="space-y-3">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + step.delay * 0.2 }}
              className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-white/80 p-3 shadow-sm backdrop-blur-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <step.icon className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{step.text}</span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1 + step.delay * 0.2 }}
                className="ml-auto"
              >
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-8"
        >
          <div className="rounded-xl border border-indigo-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Loading progress</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
                className="text-sm font-semibold text-indigo-600"
              >
                85%
              </motion.span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 2, delay: 1.5 }}
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CustomLoader
