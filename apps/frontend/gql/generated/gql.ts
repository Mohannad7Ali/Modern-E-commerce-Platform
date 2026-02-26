/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetFlaggedProducts($first: Int, $flags: [String!]) {\n    products(first: $first, filters: { flags: $flags }) {\n      products {\n        id\n        slug\n        name\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n    }\n  }\n": typeof types.GetFlaggedProductsDocument,
    "\n  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {\n    products(first: $first, skip: $skip, filters: $filters) {\n      products {\n        id\n        name\n        slug\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n      hasMore\n      totalCount\n    }\n  }\n": typeof types.GetProductsDocument,
    "\n  query GetSingleProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      isNew\n      isFeatured\n      isTrending\n      isBestSeller\n      averageRating\n      reviewCount\n      description\n      variants {\n        id\n        sku\n        price\n        images\n        stock\n        lowStockThreshold\n        barcode\n        warehouseLocation\n        attributes {\n          id\n          attribute {\n            id\n            name\n            slug\n          }\n          value {\n            id\n            value\n            slug\n          }\n        }\n      }\n      category {\n        id\n        name\n        slug\n      }\n      reviews {\n        id\n        rating\n        comment\n        user {\n          id\n          name\n          email\n        }\n        createdAt\n      }\n    }\n  }\n": typeof types.GetSingleProductDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      slug\n      name\n      description\n    }\n  }\n": typeof types.GetCategoriesDocument,
};
const documents: Documents = {
    "\n  query GetFlaggedProducts($first: Int, $flags: [String!]) {\n    products(first: $first, filters: { flags: $flags }) {\n      products {\n        id\n        slug\n        name\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n    }\n  }\n": types.GetFlaggedProductsDocument,
    "\n  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {\n    products(first: $first, skip: $skip, filters: $filters) {\n      products {\n        id\n        name\n        slug\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n      hasMore\n      totalCount\n    }\n  }\n": types.GetProductsDocument,
    "\n  query GetSingleProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      isNew\n      isFeatured\n      isTrending\n      isBestSeller\n      averageRating\n      reviewCount\n      description\n      variants {\n        id\n        sku\n        price\n        images\n        stock\n        lowStockThreshold\n        barcode\n        warehouseLocation\n        attributes {\n          id\n          attribute {\n            id\n            name\n            slug\n          }\n          value {\n            id\n            value\n            slug\n          }\n        }\n      }\n      category {\n        id\n        name\n        slug\n      }\n      reviews {\n        id\n        rating\n        comment\n        user {\n          id\n          name\n          email\n        }\n        createdAt\n      }\n    }\n  }\n": types.GetSingleProductDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      slug\n      name\n      description\n    }\n  }\n": types.GetCategoriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFlaggedProducts($first: Int, $flags: [String!]) {\n    products(first: $first, filters: { flags: $flags }) {\n      products {\n        id\n        slug\n        name\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFlaggedProducts($first: Int, $flags: [String!]) {\n    products(first: $first, filters: { flags: $flags }) {\n      products {\n        id\n        slug\n        name\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {\n    products(first: $first, skip: $skip, filters: $filters) {\n      products {\n        id\n        name\n        slug\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n      hasMore\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {\n    products(first: $first, skip: $skip, filters: $filters) {\n      products {\n        id\n        name\n        slug\n        isNew\n        isFeatured\n        isTrending\n        isBestSeller\n        averageRating\n        reviewCount\n        variants {\n          id\n          sku\n          price\n          images\n          stock\n          lowStockThreshold\n          barcode\n          warehouseLocation\n        }\n        category {\n          id\n          name\n          slug\n        }\n        reviews {\n          id\n          rating\n          comment\n        }\n      }\n      hasMore\n      totalCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSingleProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      isNew\n      isFeatured\n      isTrending\n      isBestSeller\n      averageRating\n      reviewCount\n      description\n      variants {\n        id\n        sku\n        price\n        images\n        stock\n        lowStockThreshold\n        barcode\n        warehouseLocation\n        attributes {\n          id\n          attribute {\n            id\n            name\n            slug\n          }\n          value {\n            id\n            value\n            slug\n          }\n        }\n      }\n      category {\n        id\n        name\n        slug\n      }\n      reviews {\n        id\n        rating\n        comment\n        user {\n          id\n          name\n          email\n        }\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSingleProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      isNew\n      isFeatured\n      isTrending\n      isBestSeller\n      averageRating\n      reviewCount\n      description\n      variants {\n        id\n        sku\n        price\n        images\n        stock\n        lowStockThreshold\n        barcode\n        warehouseLocation\n        attributes {\n          id\n          attribute {\n            id\n            name\n            slug\n          }\n          value {\n            id\n            value\n            slug\n          }\n        }\n      }\n      category {\n        id\n        name\n        slug\n      }\n      reviews {\n        id\n        rating\n        comment\n        user {\n          id\n          name\n          email\n        }\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    categories {\n      id\n      slug\n      name\n      description\n    }\n  }\n"): (typeof documents)["\n  query GetCategories {\n    categories {\n      id\n      slug\n      name\n      description\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;