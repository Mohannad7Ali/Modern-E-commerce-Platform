import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
}

interface AuthState {
  user: User | undefined | null
  isLoading: boolean
}

const initialState: AuthState = {
  user: undefined,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // state come from redux when we dipatch is action we get auth state from redux
    // action is simple object have type (action name) like "auth/setUser" and have payload object that was sent by user
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user
      state.isLoading = false
    },
    setUserNull: state => {
      state.user = null
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    logout: state => {
      state.user = null
      state.isLoading = false
    },
  },
})

export const { setUser, logout, setUserNull, setLoading } = authSlice.actions
export default authSlice.reducer
