import { createSlice } from '@reduxjs/toolkit'

const storedAuth = JSON.parse(localStorage.getItem('auth')) || null

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  isAuthenticated: !!storedAuth?.token,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      state.isAuthenticated = true
      localStorage.setItem('auth', JSON.stringify({ token, user }))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
