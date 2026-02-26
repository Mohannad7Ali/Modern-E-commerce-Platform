/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AbandonedCartAnalytics = {
  __typename?: 'AbandonedCartAnalytics';
  abandonmentRate: Scalars['Float']['output'];
  potentialRevenueLost: Scalars['Float']['output'];
  totalAbandonedCarts: Scalars['Int']['output'];
};

export type Attribute = {
  __typename?: 'Attribute';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type AttributeValue = {
  __typename?: 'AttributeValue';
  id: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type Changes = {
  __typename?: 'Changes';
  averageOrderValue?: Maybe<Scalars['Float']['output']>;
  orders?: Maybe<Scalars['Float']['output']>;
  revenue?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
  users?: Maybe<Scalars['Float']['output']>;
};

export type DateRangeQueryInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  timePeriod?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type InteractionAnalytics = {
  __typename?: 'InteractionAnalytics';
  byType: InteractionByType;
  mostViewedProducts: Array<MostViewedProduct>;
  totalInteractions: Scalars['Int']['output'];
};

export type InteractionByType = {
  __typename?: 'InteractionByType';
  clicks: Scalars['Int']['output'];
  others: Scalars['Int']['output'];
  views: Scalars['Int']['output'];
};

export type InteractionTrend = {
  __typename?: 'InteractionTrend';
  clicks: Array<Scalars['Int']['output']>;
  labels: Array<Scalars['String']['output']>;
  others: Array<Scalars['Int']['output']>;
  views: Array<Scalars['Int']['output']>;
};

export type MonthlyTrend = {
  __typename?: 'MonthlyTrend';
  labels: Array<Scalars['String']['output']>;
  orders: Array<Scalars['Int']['output']>;
  revenue: Array<Scalars['Float']['output']>;
  sales: Array<Scalars['Int']['output']>;
  users: Array<Scalars['Int']['output']>;
};

export type MostViewedProduct = {
  __typename?: 'MostViewedProduct';
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};

export type OrderAnalytics = {
  __typename?: 'OrderAnalytics';
  averageOrderValue: Scalars['Float']['output'];
  changes: Changes;
  totalOrders: Scalars['Int']['output'];
  totalSales: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  averageRating: Scalars['Float']['output'];
  category?: Maybe<Category>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isBestSeller: Scalars['Boolean']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isNew: Scalars['Boolean']['output'];
  isTrending: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  reviewCount: Scalars['Int']['output'];
  reviews: Array<Review>;
  salesCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  variants: Array<ProductVariant>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  hasMore: Scalars['Boolean']['output'];
  products: Array<Product>;
  totalCount: Scalars['Int']['output'];
};

export type ProductFilters = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  flags?: InputMaybe<Array<Scalars['String']['input']>>;
  isBestSeller?: InputMaybe<Scalars['Boolean']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isTrending?: InputMaybe<Scalars['Boolean']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ProductPerformance = {
  __typename?: 'ProductPerformance';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes: Array<ProductVariantAttribute>;
  barcode?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  images: Array<Scalars['String']['output']>;
  lowStockThreshold: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  sku: Scalars['String']['output'];
  stock: Scalars['Int']['output'];
  warehouseLocation?: Maybe<Scalars['String']['output']>;
};

export type ProductVariantAttribute = {
  __typename?: 'ProductVariantAttribute';
  attribute: Attribute;
  id: Scalars['String']['output'];
  value: AttributeValue;
};

export type Query = {
  __typename?: 'Query';
  abandonedCartAnalytics: AbandonedCartAnalytics;
  bestSellerProducts: ProductConnection;
  categories: Array<Category>;
  featuredProducts: ProductConnection;
  interactionAnalytics: InteractionAnalytics;
  newProducts: ProductConnection;
  orderAnalytics: OrderAnalytics;
  product?: Maybe<Product>;
  productPerformance: Array<ProductPerformance>;
  products: ProductConnection;
  revenueAnalytics: RevenueAnalytics;
  searchDashboard: Array<SearchResult>;
  trendingProducts: ProductConnection;
  userAnalytics: UserAnalytics;
  yearRange: YearRange;
};


export type QueryAbandonedCartAnalyticsArgs = {
  params: DateRangeQueryInput;
};


export type QueryBestSellerProductsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFeaturedProductsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInteractionAnalyticsArgs = {
  params: DateRangeQueryInput;
};


export type QueryNewProductsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrderAnalyticsArgs = {
  params: DateRangeQueryInput;
};


export type QueryProductArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProductPerformanceArgs = {
  params: DateRangeQueryInput;
};


export type QueryProductsArgs = {
  filters?: InputMaybe<ProductFilters>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRevenueAnalyticsArgs = {
  params: DateRangeQueryInput;
};


export type QuerySearchDashboardArgs = {
  params: SearchInput;
};


export type QueryTrendingProductsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserAnalyticsArgs = {
  params: DateRangeQueryInput;
};

export type RevenueAnalytics = {
  __typename?: 'RevenueAnalytics';
  changes: Changes;
  monthlyTrends: MonthlyTrend;
  totalRevenue: Scalars['Float']['output'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  user?: Maybe<User>;
};

export type SearchInput = {
  searchQuery: Scalars['String']['input'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type TopUser = {
  __typename?: 'TopUser';
  email: Scalars['String']['output'];
  engagementScore: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orderCount: Scalars['Int']['output'];
  totalSpent: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UserAnalytics = {
  __typename?: 'UserAnalytics';
  changes: Changes;
  engagementScore: Scalars['Float']['output'];
  interactionTrends: InteractionTrend;
  lifetimeValue: Scalars['Float']['output'];
  repeatPurchaseRate: Scalars['Float']['output'];
  retentionRate: Scalars['Float']['output'];
  topUsers: Array<TopUser>;
  totalRevenue: Scalars['Float']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type YearRange = {
  __typename?: 'YearRange';
  maxYear: Scalars['Int']['output'];
  minYear: Scalars['Int']['output'];
};

export type GetFlaggedProductsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  flags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetFlaggedProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductConnection', products: Array<{ __typename?: 'Product', id: string, slug: string, name: string, isNew: boolean, isFeatured: boolean, isTrending: boolean, isBestSeller: boolean, averageRating: number, reviewCount: number, variants: Array<{ __typename?: 'ProductVariant', id: string, sku: string, price: number, images: Array<string>, stock: number, lowStockThreshold: number, barcode?: string | null, warehouseLocation?: string | null }>, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, reviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null }> }> } };

export type GetProductsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<ProductFilters>;
}>;


export type GetProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductConnection', hasMore: boolean, totalCount: number, products: Array<{ __typename?: 'Product', id: string, name: string, slug: string, isNew: boolean, isFeatured: boolean, isTrending: boolean, isBestSeller: boolean, averageRating: number, reviewCount: number, variants: Array<{ __typename?: 'ProductVariant', id: string, sku: string, price: number, images: Array<string>, stock: number, lowStockThreshold: number, barcode?: string | null, warehouseLocation?: string | null }>, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, reviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null }> }> } };

export type GetSingleProductQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetSingleProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, slug: string, isNew: boolean, isFeatured: boolean, isTrending: boolean, isBestSeller: boolean, averageRating: number, reviewCount: number, description?: string | null, variants: Array<{ __typename?: 'ProductVariant', id: string, sku: string, price: number, images: Array<string>, stock: number, lowStockThreshold: number, barcode?: string | null, warehouseLocation?: string | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: string, attribute: { __typename?: 'Attribute', id: string, name: string, slug: string }, value: { __typename?: 'AttributeValue', id: string, value: string, slug: string } }> }>, category?: { __typename?: 'Category', id: string, name: string, slug: string } | null, reviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null, createdAt: any, user?: { __typename?: 'User', id: string, name: string, email: string } | null }> } | null };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, slug: string, name: string, description?: string | null }> };


export const GetFlaggedProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFlaggedProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"flags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"flags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"flags"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isTrending"}},{"kind":"Field","name":{"kind":"Name","value":"isBestSeller"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"lowStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseLocation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFlaggedProductsQuery, GetFlaggedProductsQueryVariables>;
export const GetProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isTrending"}},{"kind":"Field","name":{"kind":"Name","value":"isBestSeller"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"lowStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseLocation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetProductsQuery, GetProductsQueryVariables>;
export const GetSingleProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSingleProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"isNew"}},{"kind":"Field","name":{"kind":"Name","value":"isFeatured"}},{"kind":"Field","name":{"kind":"Name","value":"isTrending"}},{"kind":"Field","name":{"kind":"Name","value":"isBestSeller"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"lowStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"warehouseLocation"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attribute"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetSingleProductQuery, GetSingleProductQueryVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;