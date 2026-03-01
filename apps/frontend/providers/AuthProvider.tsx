import { useLazyGetMeQuery } from '@/store/apis/UserApi'
import { useAppDispatch } from '@/store/hooks'
import { logout, setLoading, setUser, setUserNull } from '@/store/slices/AuthSlice'
import { useEffect } from 'react'
// When the app loads reloads or browser refresh Redux lose state → check if the user is authenticated → sync Redux state.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [triggerGetMe] = useLazyGetMeQuery() // this lazy hook work only when we call instead of work in each render

  useEffect(() => {
    ;(async () => {
      // we async func within use effect because we want to wait for the promise to resolve and useEffect itself is async function
      try {
        // without unwrap: Errors do NOT throw You must check result.error
        // With unwrap: If success → returns data If error → throws
        // unwrap is very important because we dial with result as promise and if it fail it move to catch
        dispatch(setLoading(true))
        const response = await triggerGetMe().unwrap()
        // The backend returns { success, message, user }
        const user = response.user
        if (user) {
          dispatch(setUser({ user }))
          dispatch(setLoading(false))
        } else {
          dispatch(setUserNull())
          dispatch(setLoading(false))
          console.log('No user data in response ')
        }
      } catch (error: any) {
        console.log('error: ', error)
        dispatch(logout())
        dispatch(setLoading(false))
        // ✅ If it's a 401, user is unauthenticated — expected
        if (error?.status === 401) {
          dispatch(logout())
        } else {
          dispatch(logout())
          console.log(
            'Unexpected error during auth from AuthProvider (No user data in response )',
            error?.data?.message ?? '',
          )
        }
      }
    })()
  }, [])
  //[] this code will work one time only when the component mounts

  return <>{children}</>
}
