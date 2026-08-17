import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from '../authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status === 401) {
    api.dispatch(logout())
  }
  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Bets'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => ({ token: response.token, user: response.data }),
    }),
    getUserInfo: builder.query({
      query: () => '/user/userinfo',
      transformResponse: (response) => response.data,
    }),
    getSports: builder.query({
      query: () => '/user/sports',
      transformResponse: (response) => response.data,
    }),
    getEvents: builder.query({
      query: (etid) => `/user/events?etid=${etid}`,
      transformResponse: (response) => response.data,
    }),
    placeBet: builder.mutation({
      query: (bet) => ({
        url: '/user/bets',
        method: 'POST',
        body: bet,
      }),
      invalidatesTags: ['Bets'],
    }),
    getBets: builder.query({
      query: () => '/user/bets',
      transformResponse: (response) => response.data,
      providesTags: ['Bets'],
    }),
    getMatchOddsBook: builder.query({
      query: (marketId) => `/user/bets/matchodds/${marketId}/book`,
      transformResponse: (response) => response.book,
      providesTags: ['Bets'],
    }),
    getBookmakerBook: builder.query({
      query: (marketId) => `/user/bets/bookmaker/${marketId}/book`,
      transformResponse: (response) => response.book,
      providesTags: ['Bets'],
    }),
    getFancyPl: builder.query({
      query: (gmid) => `/user/bets/fancy/pl?gmid=${gmid}`,
      transformResponse: (response) => response.data,
      providesTags: ['Bets'],
    }),
    getFancyBook: builder.query({
      query: (fancyId) => `/user/bets/fancy/${fancyId}/book`,
      transformResponse: (response) => response.book,
      providesTags: ['Bets'],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetUserInfoQuery,
  useGetSportsQuery,
  useGetEventsQuery,
  usePlaceBetMutation,
  useGetBetsQuery,
  useGetMatchOddsBookQuery,
  useGetBookmakerBookQuery,
  useGetFancyPlQuery,
  useGetFancyBookQuery,
} = authApi
