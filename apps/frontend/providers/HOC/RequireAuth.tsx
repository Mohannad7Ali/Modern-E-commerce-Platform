import { useRouter } from 'next/navigation'
import CustomLoader from '@/components/feedback/CustomLoader'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export function RequireAuth<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    console.log('isAuthenticated: ', isAuthenticated)
    console.log('isLoading: ', isLoading)
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/sign-in')
      }
    }, [isLoading, isAuthenticated])

    if (isLoading) return <CustomLoader />

    return <Component {...props} />
  }
}
