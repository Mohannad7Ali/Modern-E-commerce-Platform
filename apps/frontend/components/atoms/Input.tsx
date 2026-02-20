'use client'

import { Controller } from 'react-hook-form'
import { LucideIcon } from 'lucide-react'

interface InputProps {
  label?: string
  control: any
  name: string
  type?: string
  placeholder?: string
  validation?: object
  icon?: LucideIcon
  className?: string
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({
  control,
  label,
  name,
  type = 'text',
  placeholder,
  validation = {},
  icon: Icon,
  className = '',
  error,
  onChange,
}) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {/* 1. Label - أكثر أناقة مع تباعد أفضل */}
      {label && <label className="ml-1 text-sm font-semibold text-gray-700">{label}</label>}

      <div className="group relative">
        {/* 2. Controller & Input */}
        <Controller
          name={name}
          control={control}
          rules={validation}
          render={({ field }) => (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`/* الحالة العادية */ /* حالة التركيز (Focus) */ /* حالة وجود خطأ */ w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 text-gray-800 transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${error ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''} ${Icon ? 'pr-11' : ''} ${className} `}
              onChange={e => {
                field.onChange(e)
                if (onChange) onChange(e)
              }}
            />
          )}
        />

        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon
              className={`h-5 w-5 transition-colors duration-200 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`}
            />
          </div>
        )}
      </div>

      {error && <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export default Input
