'use client'
import { useState } from 'react'
import MainLayout from '@/components/templates/MainLayout'
import BreadCrumb from '@/components/feedback/BreadCrumb'
import { useParams } from 'next/navigation'
import ProductImageGallery from '../ProductImageGallery'
import ProductInfo from '../ProductInfo'
import ProductReviews from '../ProductReviews'
import { useQuery } from '@apollo/client/react'
import { generateProductPlaceholder } from '@/utils/placeholderImage'
import { GET_SINGLE_PRODUCT } from '@/gql/Product'
import ProductDetailSkeletonLoader from '@/components/feedback/ProductDetailSkeletonLoader'
import { Product } from '@/types/productTypes'
import { GetSingleProductQuery } from '@/gql/generated/graphql'
type SingleProductType = GetSingleProductQuery['product']
type VariantType = NonNullable<GetSingleProductQuery['product']>['variants'][0]
type ReviewType = NonNullable<GetSingleProductQuery['product']>['reviews'][0]
const ProductDetailsPage = () => {
  const { slug } = useParams()
  const { data, loading, error } = useQuery<GetSingleProductQuery>(GET_SINGLE_PRODUCT, {
    variables: { slug: typeof slug === 'string' ? slug : slug?.[0] || '' },
    fetchPolicy: 'no-cache',
  })
  console.log('product data:', data)

  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  if (loading) return <ProductDetailSkeletonLoader />
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">Error loading product: {error.message}</p>
      </div>
    )
  }
  const product = data?.product

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    )
  }
  // 1. Grouping attributes based on the currently selected filters
  // ex when user select color red we search for all variants that have color red and then we group the remaining attributes of those variants to show only relevant options for the user
  // that revent falsy compo
  const attributeGroups = product.variants.reduce(
    (acc, variant) => {
      // Check if the user has selected any attribute filter (e.g., Color or Size)
      const hasSelections = Object.values(selectedAttributes).some(value => value !== '')

      // Determine if the current variant in the loop matches all the user's selections
      const matchesSelections = hasSelections
        ? Object.entries(selectedAttributes).every(
            ([attrName, attrValue]) =>
              // Skip empty selection keys or verify the variant has this specific attribute name and value
              attrName === '' ||
              variant.attributes.some(attr => attr.attribute.name === attrName && attr.value.value === attrValue),
          )
        : true // If no selections are made, all variants are considered a match by default

      // If the variant matches the criteria, we extract its attributes to update the UI options
      if (matchesSelections) {
        variant.attributes.forEach(({ attribute, value }) => {
          // If this attribute category (e.g., "Color") isn't in our accumulator yet, initialize it
          if (!acc[attribute.name]) {
            acc[attribute.name] = { values: new Set<string>() }
          }
          // Add the attribute value to the Set (Set automatically handles uniqueness)
          acc[attribute.name].values.add(value.value)
        })
      }

      return acc // Return the accumulated attr groups for the next iteration
    },
    {} as Record<string, { values: Set<string> }>,
  )

  // 2. Function to clear all selections and reset the state
  const resetSelections = () => {
    setSelectedAttributes({}) // Clear the selected attributes object
    setSelectedVariant(null) // Clear the currently matched specific variant
  }

  // 3. Function to handle when a user clicks/selects an attribute value
  const handleVariantChange = (attributeName: string, value: string) => {
    // Create a new selection object by merging the old selections with the new one
    const newSelections = { ...selectedAttributes, [attributeName]: value }
    setSelectedAttributes(newSelections) // Update the state with the new selections

    // Look through all product variants to find the one that perfectly matches the new selections
    const variant = product.variants.find(v =>
      Object.entries(newSelections).every(
        ([attrName, attrValue]) =>
          // Ensure the variant contains an attribute matching the name and value from our selections
          attrName === '' ||
          v.attributes.some(attr => attr.attribute.name === attrName && attr.value.value === attrValue),
      ),
    )

    // Update the selected variant state (sets it to the found variant or null if no exact match exists)
    setSelectedVariant(variant || null)
  }
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <BreadCrumb />
          </div>
        </div>

        {/* Product Details */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <ProductImageGallery
                images={product.variants.flatMap(v => v.images)}
                defaultImage={
                  selectedVariant?.images[0] ||
                  product.variants[0]?.images[0] ||
                  generateProductPlaceholder(product.name)
                }
                name={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <ProductInfo
                id={product.id}
                name={product.name}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
                description={product.description || 'No description available'}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={handleVariantChange}
                attributeGroups={attributeGroups}
                selectedAttributes={selectedAttributes}
                resetSelections={resetSelections}
              />
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <ProductReviews reviews={product.reviews} productId={product.id} />
          </div>
        </div>
      </div>
    </>
  )
}
export default ProductDetailsPage
