import { apiSlice } from '../slices/ApiSlice'

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createInteraction: builder.mutation<
      { message: string; interaction: any },
      { userId: string; productId?: string; type: string }
    >({
      query: data => ({
        url: '/analytics/interactions',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useCreateInteractionMutation } = analyticsApi
