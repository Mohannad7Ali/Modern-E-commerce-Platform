'use client'
import Rating from '@/components/feedback/Rating'
import { useAddToCartMutation } from '@/store/apis/CartApi'
import useToast from '@/hooks/ui/useToast'
import { Product } from '@/types/productTypes'
import { Palette, Ruler, Info, Package, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import getColorValue from '@/utils/getColorValue'
import { GetSingleProductQuery } from '@/gql/generated/graphql'
type SingleProductType = GetSingleProductQuery['product']
type VariantType = NonNullable<GetSingleProductQuery['product']>['variants'][0]
interface ProductInfoProps {
  id: string
  name: string
  averageRating: number
  reviewCount: number
  description: string
  variants: VariantType[]
  selectedVariant: VariantType | null
  onVariantChange: (attributeName: string, value: string) => void
  attributeGroups: Record<string, { values: Set<string> }>
  selectedAttributes: Record<string, string>
  resetSelections: () => void
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  averageRating,
  reviewCount,
  description,
  variants,
  selectedVariant,
  onVariantChange,
  attributeGroups,
  selectedAttributes,
  resetSelections,
}) => {
  const { showToast } = useToast()
  const [addToCart, { isLoading }] = useAddToCartMutation()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selectedVariant) {
      showToast('Please select a valid variant', 'error')
      return
    }
    try {
      const res = await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
      })
      console.log(res)
      showToast('Product added to cart', 'success')
    } catch (error: any) {
      showToast(error.data?.message || 'Failed to add to cart', 'error')
      console.error('Error adding to cart:', error)
    }
  }

  const price = selectedVariant ? selectedVariant.price : variants[0]?.price || 0
  const stock = selectedVariant ? selectedVariant.stock : variants[0]?.stock || 0

  // Compute available colors and sizes
  const colorValues = new Set<string>()
  const sizeValues = new Set<string>()
  variants.forEach(variant => {
    variant.attributes.forEach(({ attribute, value }) => {
      if (attribute.name.toLowerCase() === 'color') {
        colorValues.add(value.value)
      } else if (attribute.name.toLowerCase() === 'size') {
        sizeValues.add(value.value)
      }
    })
  })

  // Generate attribute summary
  const attributeSummary = Object.entries(attributeGroups)
    .map(([attrName, { values }]) => {
      const valueList = Array.from(values).join(', ')
      return `${attrName.charAt(0).toUpperCase() + attrName.slice(1)}: ${valueList}`
    })
    .join('; ')

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6">
      {/* Product Name */}
      <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">{name}</h1>

      {/* Rating and Stock */}
      <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
        <Rating rating={averageRating} />
        <span>({reviewCount || 0} reviews)</span>
        <span
          className={`ml-2 rounded px-2 py-1 text-xs font-medium ${
            stock > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-gray-900 sm:text-3xl">${price.toFixed(2)}</div>

      {/* Available Options */}
      <div className="space-y-3">
        {colorValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Available in {colorValues.size} {colorValues.size === 1 ? 'color' : 'colors'}
            </span>
          </div>
        )}

        {sizeValues.size > 0 && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Available in {sizeValues.size} {sizeValues.size === 1 ? 'size' : 'sizes'}
            </span>
          </div>
        )}

        {attributeSummary && (
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{attributeSummary}</span>
          </div>
        )}

        {colorValues.size === 0 && sizeValues.size === 0 && attributeSummary === '' && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">No options available</span>
          </div>
        )}
      </div>

      {/* Variant Selection */}
      <div className="space-y-6">
        {Object.entries(attributeGroups).map(([attributeName, { values }]) => {
          const isColor = attributeName.toLowerCase() === 'color'
          const isSize = attributeName.toLowerCase() === 'size'
          const valuesArray = Array.from(values)

          return (
            <div key={attributeName} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900 capitalize">{attributeName}</label>
                {selectedAttributes[attributeName] && (
                  <button
                    onClick={() => onVariantChange(attributeName, '')}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                    Clear
                  </button>
                )}
              </div>

              {isColor ? (
                // Color Selection with Circles
                <div className="flex flex-wrap gap-3">
                  {valuesArray.map(value => {
                    const isSelected = selectedAttributes[attributeName] === value
                    const colorValue = getColorValue(value)
                    const isWhite = colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === '#fff'

                    return (
                      <motion.button
                        key={value}
                        onClick={() => onVariantChange(attributeName, value)}
                        className={`group relative ${
                          isSelected
                            ? 'ring-2 ring-indigo-500 ring-offset-2'
                            : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-indigo-300'
                        } rounded-full transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: colorValue }}
                        >
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">
                              <Check size={16} />
                            </motion.div>
                          )}
                        </div>
                        {isWhite && <div className="absolute inset-0 rounded-full border border-gray-300" />}
                        <span className="sr-only">{value}</span>
                      </motion.button>
                    )
                  })}
                </div>
              ) : isSize ? (
                // Size Selection with Buttons
                <div className="flex flex-wrap gap-2">
                  {valuesArray.map(value => {
                    const isSelected = selectedAttributes[attributeName] === value
                    const isOutOfStock = !variants.some(
                      variant =>
                        variant.attributes.some(
                          attr => attr.attribute.name === attributeName && attr.value.value === value,
                        ) && variant.stock > 0,
                    )

                    return (
                      <motion.button
                        key={value}
                        onClick={() => !isOutOfStock && onVariantChange(attributeName, value)}
                        disabled={isOutOfStock}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : isOutOfStock
                              ? 'cursor-not-allowed bg-gray-100 text-gray-400 line-through'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                        whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                        whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                      >
                        {value}
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                // Other Attributes with Buttons
                <div className="flex flex-wrap gap-2">
                  {valuesArray.map(value => {
                    const isSelected = selectedAttributes[attributeName] === value

                    return (
                      <motion.button
                        key={value}
                        onClick={() => onVariantChange(attributeName, value)}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {value}
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Selected Value Display */}
              {selectedAttributes[attributeName] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="font-medium">Selected:</span>
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-indigo-700">
                    {selectedAttributes[attributeName]}
                  </span>
                </motion.div>
              )}
            </div>
          )
        })}

        {/* Reset Button */}
        {Object.keys(selectedAttributes).length > 0 && (
          <motion.button
            onClick={resetSelections}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 px-3 py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 sm:px-4 sm:text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X size={16} />
            Reset All Selections
          </motion.button>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          disabled={!stock || isLoading || !selectedVariant}
          onClick={handleAddToCart}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300 sm:py-4 sm:text-base ${
            isLoading || !stock || !selectedVariant
              ? 'cursor-not-allowed bg-gray-400'
              : 'transform bg-indigo-600 shadow-lg hover:scale-[1.02] hover:bg-indigo-700 hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Adding to Cart...
            </div>
          ) : stock > 0 && selectedVariant ? (
            'Add to Cart'
          ) : (
            'Select a Variant'
          )}
        </button>
        <button
          disabled={!stock || !selectedVariant}
          className={`w-full rounded-xl border-2 py-3 text-sm font-semibold transition-all duration-300 sm:py-4 sm:text-base ${
            stock && selectedVariant
              ? 'transform border-indigo-600 text-indigo-600 hover:scale-[1.02] hover:bg-indigo-50 hover:shadow-lg'
              : 'cursor-not-allowed border-gray-300 text-gray-400'
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductInfo
