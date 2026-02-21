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
}

const initialState: AuthState = {
  user: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // state come from redux when we dipatch is action we get auth state from redux
    // action is simple object have type (action name) like "auth/setUser" and have payload object that was sent by user
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user
    },
    setUserNull: state => {
      state.user = null
    },
    logout: state => {
      state.user = null
    },
  },
})

export const { setUser, logout, setUserNull } = authSlice.actions
export default authSlice.reducer
