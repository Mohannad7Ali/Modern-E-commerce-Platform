'use client'

import { Controller } from 'react-hook-form'
import { LucideIcon } from 'lucide-react'

interface InputProps {
  label?: string
  control: any // The 'control' object from useForm() to manage this input
  name: string // Unique name for the form field
  type?: string
  placeholder?: string
  validation?: object // Rules like { required: true, minLength: 5 }
  icon?: LucideIcon
  className?: string
  error?: string // Error message to display if validation fails
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({
  control,
  label,
  name,
  type = 'text',
  placeholder,
  validation = {},
  icon: Icon, // Destructuring and renaming to 'Icon' (Capitalized) to use as a component
  className = '',
  error,
  onChange,
}) => {
  return (
    <div className="relative w-full">
      {/* 1. Label Rendering: Only shows if 'label' prop is provided */}
      {label && <label className="font-medium text-gray-700">{label}</label>}

      {/* 2. Controller: Acts as a "Wrapper" to connect the input to React Hook Form */}
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => (
          <input
            {...field} // 3. Binding: Spreads 'value', 'onBlur', 'ref', and 'onChange' into the input
            type={type}
            placeholder={placeholder}
            className={`mt-[6px] w-full border-b-2 border-gray-300 p-[14px] pr-10 pl-3 text-gray-800 placeholder:text-gray-600 focus:border-gray-700 focus:outline-none ${className}`}
            onChange={e => {
              // 4. Manual Change Handling:
              field.onChange(e) // Updates React Hook Form state
              if (onChange) onChange(e) // Executes custom logic if passed from parent
            }}
          />
        )}
      />

      {/* 5. Icon Rendering: Displays the Lucide icon at the end of the input */}
      {Icon && (
        <div className="absolute top-[63%] right-3 -translate-y-1/2 transform">
          <Icon className="h-[22px] w-[22px] text-gray-800" />
        </div>
      )}

      {/* 6. Error Message: Displays validation errors conditionally */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input
