import { GetFlaggedProductsQuery } from '@/gql/generated/graphql'
import { Product } from '../types/productTypes'

type QueryProduct = GetFlaggedProductsQuery['products']['products'][0]
const groupProductsByFlag = (products: QueryProduct[]) => {
  const flags = {
    featured: [] as QueryProduct[],
    trending: [] as QueryProduct[],
    newArrivals: [] as QueryProduct[],
    bestSellers: [] as QueryProduct[],
  }

  for (const product of products) {
    if (product.isFeatured) flags.featured.push(product)
    if (product.isTrending) flags.trending.push(product)
    if (product.isNew) flags.newArrivals.push(product)
    if (product.isBestSeller) flags.bestSellers.push(product)
  }

  return flags
}

export default groupProductsByFlag
