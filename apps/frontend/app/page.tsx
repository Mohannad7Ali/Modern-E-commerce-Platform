'use client'
import dynamic from 'next/dynamic'
import { GET_PRODUCTS_SUMMARY } from '@/gql/Product'
import { useMemo } from 'react'
import groupProductsByFlag from '@/utils/groupProductsByFlag'
import SkeletonLoader from '@/components/feedback/SkeletonLoader'
import { useQuery } from '@apollo/client/react'
import { GetFlaggedProductsQuery } from '@/gql/generated/graphql'

// الاستيراد الديناميكي لتحسين الأداء
const HeroSection = dynamic(() => import('./(public)/(home)/HeroSection'), { ssr: false })
const CategoryBar = dynamic(() => import('./(public)/(home)/CategoryBar'), { ssr: false })
const ProductSection = dynamic(() => import('./(public)/product/ProductSection'), { ssr: false })

const Home = () => {
  // استخدام النوع المولد <GetFlaggedProductsQuery> يضمن سلامة البيانات
  const { data, loading, error } = useQuery<GetFlaggedProductsQuery>(GET_PRODUCTS_SUMMARY, {
    variables: { first: 100 },
    fetchPolicy: 'no-cache',
  })

  const { featured, trending, newArrivals, bestSellers } = useMemo(() => {
    // التحقق من وجود البيانات قبل تمريرها للدالة
    if (!data?.products?.products) {
      return { featured: [], trending: [], newArrivals: [], bestSellers: [] }
    }
    // الآن لن يظهر خطأ هنا لأن الدالة والـ Query يتحدثان نفس "اللغة"
    return groupProductsByFlag(data.products.products)
  }, [data])

  if (loading) {
    return (
      <>
        <HeroSection />
        <SkeletonLoader />
      </>
    )
  }

  // في حال وجود خطأ، يمكنك عرضه هنا أو تمريره للمكونات
  if (error) console.error('GraphQL Error:', error)

  return (
    <div>
      <HeroSection />
      <CategoryBar />
      <ProductSection title="Featured" products={featured} loading={false} error={error} showTitle={true} />
      <ProductSection title="Trending" products={trending} loading={false} error={error} showTitle={true} />
      <ProductSection title="New Arrivals" products={newArrivals} loading={false} error={error} showTitle={true} />
      <ProductSection title="Best Sellers" products={bestSellers} loading={false} error={error} showTitle={true} />
    </div>
  )
}

export default Home
