'use client'

import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { UseFormRegister, FieldErrors, UseFormWatch, FieldValues, Path } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[0-9]/, 'Password must include at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character')

interface PasswordFieldProps<T extends FieldValues> {
  name?: Path<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  watch: UseFormWatch<T>
}

function PasswordField<T extends FieldValues>({ name, register, errors, watch }: PasswordFieldProps<T>) {
  const fieldName = (name ?? 'password') as Path<T>

  const passwordValue = watch(fieldName, '' as any)

  const [strength, setStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    let score = 0
    if (passwordValue?.length >= 8) score++
    if (/[A-Z]/.test(passwordValue)) score++
    if (/[0-9]/.test(passwordValue)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) score++
    setStrength(score)
  }, [passwordValue])

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        {...register(fieldName, {
          required: 'Password is required',
          validate: (value: string) => {
            const result = passwordSchema.safeParse(value)
            if (result.success) return true
            return result.error.issues[0]?.message || 'Invalid password'
          },
        })}
        className="w-full border-b-2 border-gray-300 p-[17px] pr-12 pl-3 text-gray-800 placeholder:text-gray-600 focus:border-gray-700 focus:outline-none"
      />

      {/* Show / Hide Button */}
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="absolute top-[40%] right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {errors[fieldName] && <p className="mt-1 text-sm text-red-500">{errors[fieldName]?.message as string}</p>}

      {/* Strength Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-center gap-[2px] py-2">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className="h-[6px] w-[100px] flex-1 rounded"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: strength > index ? 1 : 0.3 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                backgroundColor: strength > index ? 'rgb(34, 197, 94)' : 'rgb(229, 231, 235)',
                transformOrigin: 'left',
              }}
            />
          ))}
        </div>

        <p className="text-right text-[12px] text-gray-500">
          {strength === 1
            ? 'Very weak'
            : strength === 2
              ? 'Weak'
              : strength === 3
                ? 'Good'
                : strength === 4
                  ? 'Strong'
                  : 'Password strength'}
        </p>
      </div>
    </div>
  )
}

export default PasswordField
