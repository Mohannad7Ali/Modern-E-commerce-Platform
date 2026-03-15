import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./AuthSlice";
import { API_BASE_URL } from "@/app/lib/constants/config";

// Base query using fetchBaseQuery (a lightweight wrapper over fetch)
const baseQuery = fetchBaseQuery({
  // Base URL for all API requests
  baseUrl: API_BASE_URL,

  // Include cookies in every request (for HTTP-only JWT auth)
  credentials: "include",
});

// Custom baseQuery wrapper to handle token refresh automatically
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Execute original request
  let result = await baseQuery(args, api, extraOptions);

  // If request failed with 401 (Unauthorized)
  if (result.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    // If refresh succeeds
    if (refreshResult.data) {
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, log the user out
      api.dispatch(logout());
    }
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  // Unique key in Redux state
  reducerPath: "api",

  // Use custom base query with reauthentication
  baseQuery: baseQueryWithReauth,

  // Define tag types for cache invalidation
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Review",
    "Section",
    "Transactions",
    "Logs",
    "Attribute",
    "Variant",
  ],

  // Endpoints will be injected later using injectEndpoints
  endpoints: () => ({}),
});
