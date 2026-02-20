import { apiSlice } from '../slices/ApiSlice'
import { setUser, logout } from '../slices/AuthSlice'

interface User {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  avatar: string | null
}
// inject new endpoint inside apislice without creating new api service (layer)
export const authApi = apiSlice.injectEndpoints({
  // builder is factory to build query (GET) mutation (POST/PUT/DELETE)
  endpoints: builder => ({
    // mutation<ResponseType, RequestType>
    signIn: builder.mutation<{ accessToken: string; user: User }, { email: string; password: string }>({
      query: credentials => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
      // lifecycle hook run automatically after send req
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        //queryFulfilled is promise represent req result
        const { data } = await queryFulfilled
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }))
      },
    }),
    signup: builder.mutation<{ accessToken: string; user: User }, { name: string; email: string; password: string }>({
      query: data => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }))
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/sign-out',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(logout())
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
    checkAuth: builder.mutation<{ accessToken: string; user: User }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        // Backend returns { success, message, user }
        dispatch(setUser({ user: data.user }))
      },
    }),
  }),
})

export const {
  useSignInMutation,
  useSignupMutation,
  useSignOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCheckAuthMutation,
} = authApi
