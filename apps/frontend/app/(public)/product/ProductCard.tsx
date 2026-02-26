import { Product } from '@/types/productTypes'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateProductPlaceholder } from '@/utils/placeholderImage'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Rating from '@/components/feedback/Rating'
import useTrackInteraction from '@/hooks/miscellaneous/useTrackInteraction'
import { GetFlaggedProductsQuery } from '@/gql/generated/graphql'
type QueryProduct = GetFlaggedProductsQuery['products']['products'][0]
interface ProductCardProps {
  product: Product | QueryProduct
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const { trackInteraction } = useTrackInteraction()
  useEffect(() => {
    trackInteraction(product.id, 'view')
  }, [product.id, trackInteraction])
  const inStockVariants = product.variants.filter(variant => variant.stock > 0)
  const lowestPrice = inStockVariants.length > 0 ? Math.min(...inStockVariants.map(variant => variant.price)) : 0
  const handleClick = () => {
    trackInteraction(product.id, 'click')
    router.push(`/product/${product.slug}`)
  }
  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-gray-100 bg-white"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gray-50 sm:h-[170px]">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.variants[0]?.images[0] || generateProductPlaceholder(product.name)}
            alt={product.name}
            width={240}
            height={240}
            className="mx-auto object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 20vw"
            onError={e => {
              e.currentTarget.src = generateProductPlaceholder(product.name)
            }}
          />
        </Link>

        {/* Product Flags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">NEW</span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-purple-500 px-1.5 py-0.5 text-xs font-bold text-white">FEATURED</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 z-10 flex cursor-pointer space-x-1">
          <Link href={`/product/${product.slug}`}>
            <div
              className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm"
              aria-label="View product details"
            >
              <Eye size={14} className="text-gray-700" />
            </div>
          </Link>
        </div>

        {/* Stock Status */}
        {inStockVariants.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-3 sm:p-4 lg:p-5">
        <Link href={`/product/${product.slug}`} className="block flex-grow">
          <h3 className="mb-2 line-clamp-2 text-xs leading-tight font-semibold text-gray-900 sm:text-sm lg:text-base">
            {product.name}
          </h3>

          <div className="mb-2 flex items-center justify-between sm:mb-3">
            <div className="flex items-center space-x-2">
              {inStockVariants.length > 0 ? (
                <span className="text-sm font-bold text-indigo-700 sm:text-lg lg:text-xl">
                  ${lowestPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-500 sm:text-lg lg:text-xl">Out of stock</span>
              )}
            </div>
            <div className="flex items-center">
              <Rating rating={product.averageRating} />
              {product.reviewCount > 0 && (
                <span className="ml-1 text-xs text-gray-500 lg:text-sm">({product.reviewCount})</span>
              )}
            </div>
          </div>

          {/* Category */}
          {product.category && <div className="mb-2 text-xs text-gray-500 lg:text-sm">{product.category.name}</div>}
        </Link>

        {/* Quick Actions */}
        <div className="mt-auto border-t border-gray-100 pt-2 sm:pt-3">
          <button
            className="w-full cursor-pointer rounded-sm bg-indigo-600 py-2 text-xs font-medium text-white hover:opacity-90 sm:py-2.5 sm:text-sm lg:py-3"
            onClick={e => {
              e.stopPropagation()
              handleClick()
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
