import AppError from '@/shared/errors/AppError';
import { PrismaClient, Prisma } from '@/generated/prisma-client/client';
import { Request, Response } from 'express';

interface FilterType {
  search?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  flags?: string[] | null;
}

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const productResolvers = {
  Query: {
    products: async (
      _: unknown,
      { first = 10, skip = 0, filters }: { first?: number; skip?: number; filters?: FilterType | null },
      context: Context
    ) => {
      // Handle null filters safely
      const safeFilters: FilterType = filters ?? {};

      const where: Prisma.ProductWhereInput = {};

      /* -------------------- SEARCH -------------------- */
      if (safeFilters.search) {
        where.OR = [
          { name: { contains: safeFilters.search, mode: 'insensitive' } },
          { description: { contains: safeFilters.search, mode: 'insensitive' } }
        ];
      }

      /* -------------------- DIRECT BOOLEAN FILTERS -------------------- */
      if (safeFilters.isNew !== undefined) where.isNew = safeFilters.isNew;
      if (safeFilters.isFeatured !== undefined) where.isFeatured = safeFilters.isFeatured;
      if (safeFilters.isTrending !== undefined) where.isTrending = safeFilters.isTrending;
      if (safeFilters.isBestSeller !== undefined) where.isBestSeller = safeFilters.isBestSeller;

      /* -------------------- FLAGS (SAFE MAPPING) -------------------- */
      if (safeFilters.flags && safeFilters.flags.length > 0) {
        const flagMap: Record<string, keyof Prisma.ProductWhereInput> = {
          new: 'isNew',
          featured: 'isFeatured',
          trending: 'isTrending',
          bestSeller: 'isBestSeller'
        };

        const flagConditions: Prisma.ProductWhereInput[] = safeFilters.flags
          .filter(flag => flagMap[flag])
          .map(flag => ({
            [flagMap[flag]]: true
          }));

        if (flagConditions.length > 0) {
          where.OR = where.OR ? [...(where.OR as Prisma.ProductWhereInput[]), ...flagConditions] : flagConditions;
        }
      }

      /* -------------------- CATEGORY -------------------- */
      if (safeFilters.categoryId) {
        where.categoryId = safeFilters.categoryId;
      }

      /* -------------------- PRICE RANGE -------------------- */
      if (safeFilters.minPrice !== undefined || safeFilters.maxPrice !== undefined) {
        where.variants = {
          some: {
            price: {
              ...(safeFilters.minPrice !== undefined && {
                gte: safeFilters.minPrice
              }),
              ...(safeFilters.maxPrice !== undefined && {
                lte: safeFilters.maxPrice
              })
            }
          }
        };
      }

      /* -------------------- DATABASE QUERIES -------------------- */
      const [products, totalCount] = await Promise.all([
        context.prisma.product.findMany({
          where,
          take: first,
          skip,
          include: {
            category: true,
            variants: true,
            reviews: {
              include: {
                user: true
              }
            }
          }
        }),
        context.prisma.product.count({ where })
      ]);

      return {
        products,
        hasMore: skip + products.length < totalCount,
        totalCount
      };
    },

    /* -------------------- SINGLE PRODUCT -------------------- */
    product: async (_: unknown, { slug }: { slug: string }, context: Context) => {
      const product = await context.prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          variants: {
            include: {
              attributes: {
                include: {
                  attribute: true,
                  value: true
                }
              }
            }
          },
          reviews: {
            include: {
              user: true
            }
          }
        }
      });

      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      return product;
    },

    /* -------------------- FLAG QUERIES -------------------- */
    newProducts: (_: unknown, args: any, context: Context) => getFlagProducts('isNew', args, context),

    featuredProducts: (_: unknown, args: any, context: Context) => getFlagProducts('isFeatured', args, context),

    trendingProducts: (_: unknown, args: any, context: Context) => getFlagProducts('isTrending', args, context),

    bestSellerProducts: (_: unknown, args: any, context: Context) => getFlagProducts('isBestSeller', args, context),

    /* -------------------- CATEGORIES -------------------- */
    categories: async (_: unknown, __: unknown, context: Context) => {
      return context.prisma.category.findMany({
        include: {
          products: {
            include: {
              variants: true
            }
          }
        }
      });
    }
  }
};

/* ========================================================= */
/* =================== HELPER FUNCTION ===================== */
/* ========================================================= */

async function getFlagProducts(
  field: 'isNew' | 'isFeatured' | 'isTrending' | 'isBestSeller',
  { first = 10, skip = 0 }: { first?: number; skip?: number },
  context: Context
) {
  const where: Prisma.ProductWhereInput = {
    [field]: true
  };

  const [products, totalCount] = await Promise.all([
    context.prisma.product.findMany({
      where,
      take: first,
      skip,
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: true
          }
        }
      }
    }),
    context.prisma.product.count({ where })
  ]);

  return {
    products,
    hasMore: skip + products.length < totalCount,
    totalCount
  };
}
