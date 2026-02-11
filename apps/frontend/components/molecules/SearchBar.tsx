'use client'

import { useForm } from 'react-hook-form'
import { Clock, Search } from 'lucide-react'
import useStorage from '@/hooks/state/useStorage'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
type SearchFormValues = {
  searchQuery: string
}

export default function SearchBar({ placeholder = 'Search products...' }) {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false)

  const [recentQueries, setRecentQueries] = useStorage<string[]>('recentQueries', [])
  // react hook form to manage form state and validation
  const { register, handleSubmit, setValue, watch } = useForm<SearchFormValues>({
    defaultValues: { searchQuery: '' },
  })
  // register : use to bind input field to react hook form , give it name and watch its changes automatically
  // handleSubmit : wrapper function organize sending data only if data is true and prevent default reload
  // setValue : sometimes we need to change value of input field programmatically like when user click on recent query we want to set it in input field
  // watch : to watch changes real time moment by moment in input field and get its value to show or hide clear button
  const searchQuery = watch('searchQuery')

  const onSubmit = (data: SearchFormValues) => {
    const query = data.searchQuery.trim()
    if (!query) return

    const updatedQueries = [query, ...recentQueries.filter(q => q !== query)].slice(0, 5)
    setRecentQueries(updatedQueries)

    setIsFocused(false)
    router.push(`/shop?search=${encodeURIComponent(query)}`)
  }

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="group relative">
        <div className="relative flex items-center">
          {/* أيقونة البحث الثابتة */}
          <Search
            className={`absolute left-3 transition-colors ${isFocused ? 'text-primary' : 'text-gray-400'}`}
            size={18}
          />

          <input
            {...register('searchQuery')}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !isHoveringDropdown && setIsFocused(false)}
            placeholder={placeholder}
            autoComplete="off"
            className="focus:border-primary focus:ring-primary/20 w-full rounded-full border-2 border-gray-100 bg-white py-2.5 pr-12 pl-10 transition-all duration-400 outline-none focus:ring-2"
          />

          {/* زر مسح النص - يظهر بحركة ناعمة */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setValue('searchQuery', '')}
                type="button"
                className="absolute right-12 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="bg-primary absolute right-2 cursor-pointer rounded-full p-1.5 text-white transition-transform hover:scale-105"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
      {/* القائمة المنسدلة   */}
      <AnimatePresence>
        {(isFocused || isHoveringDropdown) && recentQueries.length > 0 && (
          <motion.div
            onMouseEnter={() => setIsHoveringDropdown(true)}
            onMouseLeave={() => setIsHoveringDropdown(false)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
          >
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="flex items-center font-medium text-gray-500">
                  <Clock size={14} className="mr-2" /> Recent Searches
                </span>
                <button onClick={() => setRecentQueries([])} className="text-primary text-xs hover:underline">
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {recentQueries.map((query, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setValue('searchQuery', query)
                      handleSubmit(onSubmit)()
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <span className="truncate text-sm text-gray-700">{query}</span>
                    <X
                      size={12}
                      className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
                      onClick={e => {
                        e.stopPropagation()
                        setRecentQueries(recentQueries.filter((_, i) => i !== index))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
