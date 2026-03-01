import { useAppSelector } from './state/useRedux'

export function useAuth() {
  const { user, isLoading } = useAppSelector(state => state.auth)

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || false, // hydration in progress
  }
}
