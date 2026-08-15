import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Bets'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
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
    placeFancyBet: builder.mutation({
      query: (bet) => ({
        url: '/user/bets/fancy',
        method: 'POST',
        body: bet,
      }),
      invalidatesTags: ['Bets'],
    }),
    placeBookmakerBet: builder.mutation({
      query: (bet) => ({
        url: '/user/bets/bookmaker',
        method: 'POST',
        body: bet,
      }),
      invalidatesTags: ['Bets'],
    }),
    getBets: builder.query({
      query: (gmid) => `/user/bets?gmid=${gmid}`,
      transformResponse: (response) => response.data,
      providesTags: ['Bets'],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetUserInfoQuery,
  useGetSportsQuery,
  useGetEventsQuery,
  usePlaceFancyBetMutation,
  usePlaceBookmakerBetMutation,
  useGetBetsQuery,
} = authApi
