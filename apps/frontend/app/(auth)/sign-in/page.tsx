'use client'
import Input from '@/components/atoms/Input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import GoogleIcon from '@/assets/icons/google.png'
import { AUTH_API_BASE_URL } from '@/lib/constants/config'
interface InputForm {
  email: string
  password: string
}
const SignIn = () => {
  const router = useRouter()
  const isLoading = false
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({ defaultValues: { email: '', password: '' } })
  const onSubmit = async (formData: InputForm) => {
    try {
      router.push('/')
    } catch (error) {
      console.error('error: ', error)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    // console.log('Using AUTH API URL:', AUTH_API_BASE_URL)
    // window.location.href = `${AUTH_API_BASE_URL}/auth/${provider}`
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <main className="rouded-lg w-full max-w-md bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 sm:text-3xl">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="email"
            type="text"
            placeholder="Email"
            control={control}
            validation={{ required: 'Email is required' }}
            error={errors.email?.message}
            className="py-2.5 text-sm"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            control={control}
            validation={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            }}
            error={errors.password?.message}
            className="py-2.5 text-sm"
          />
          <Link href="/password-reset" className="mb-4 block text-sm text-indigo-600 hover:underline">
            Forgot password?
          </Link>
          <button
            type="submit"
            className={`w-full rounded-md bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 ${
              isLoading ? 'cursor-not-allowed bg-gray-400' : ''
            }`}
          >
            {isLoading ? <Loader2 className="mx-auto animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </div>
        {/* Testing Instructions */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-blue-800">🧪 Testing Accounts</h3>
          <div className="space-y-1 text-xs text-blue-700">
            <div>
              <strong>Superadmin:</strong> superadmin@example.com / password123
            </div>
            <div>
              <strong>Admin:</strong> admin@example.com / password123
            </div>
            <div>
              <strong>User:</strong> user@example.com / password123
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">
            These accounts have different permissions for testing various features.
          </p>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <div className="space-y-2">
          {[
            {
              provider: 'google',
              icon: GoogleIcon,
              label: 'Sign in with Google',
            },
          ].map(({ provider, icon, label }) => (
            <button
              key={provider}
              onClick={() => handleOAuthLogin(provider)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-100 bg-transparent py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-gray-200"
            >
              <Image width={20} height={20} src={icon} alt={provider} />
              {label}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default SignIn
