import { configureStore } from '@reduxjs/toolkit'
// import toastReducer from './slices/ToastSlice'
import { apiSlice } from './slices/ApiSlice'
import authReducer from './slices/AuthSlice'

// Create the Redux store using Redux Toolkit
export const store = configureStore({
  // Combine all reducers into one root reducer
  reducer: {
    // Auth slice handles user authentication state
    auth: authReducer,
    // Toast slice handles global notifications
    // toasts: toastReducer,
    // RTK Query reducer handles API cache and state
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  // Configure middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Disable serializable check because RTK Query may store non-serializable values
      serializableCheck: false,
    }).concat(
      // Add RTK Query middleware for caching and invalidation
      // apiSlice.middleware,
      apiSlice.middleware,
    ),

  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',

  // Initial state (useful for SSR or hydration)
  preloadedState: {},
})

// Infer the RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>

// Infer AppDispatch type
export type AppDispatch = typeof store.dispatch

// Infer full store type
export type AppStore = typeof store
