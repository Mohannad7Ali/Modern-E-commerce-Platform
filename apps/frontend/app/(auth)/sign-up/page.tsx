'use client'
import { useForm } from 'react-hook-form'
import Input from '@/components/atoms/Input'
import Link from 'next/link'
import { z } from 'zod'
import GoogleIcon from '@/assets/icons/google.png'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useSignupMutation } from '@/store/apis/AuthApi'
import { useRouter } from 'next/navigation'
import PasswordField from '@/components/molecules/PasswordField'
interface InputForm {
  name: string
  email: string
  password: string
}
const nameSchema = (value: string) => {
  const result = z.string().min(2, 'Name must be at least 2 characters long').safeParse(value)
  return result.success || result.error.issues[0].message
}

const emailSchema = (value: string) => {
  const result = z.string().email('Invalid email address').safeParse(value)
  return result.success || result.error.issues[0].message
}
export default function Signup() {
  const [signUp, { isLoading, error }] = useSignupMutation()
  const router = useRouter()
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const onSubmit = async (formData: InputForm) => {
    try {
      await signUp(formData).unwrap()
      router.push('/')
    } catch (error) {
      console.log('error: ', error)
    }
  }
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${provider}`
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 sm:text-3xl">Sign Up</h2>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-center text-sm text-red-600">
            An unexpected error occurred
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="name"
            type="text"
            placeholder="Name"
            control={control}
            validation={{
              required: 'Name is required',
              validate: nameSchema,
            }}
            error={errors.name?.message}
            className="py-2.5 text-sm"
          />

          <Input
            name="email"
            type="text"
            placeholder="Email"
            control={control}
            validation={{
              required: 'Email is required',
              validate: emailSchema,
            }}
            error={errors.email?.message}
            className="py-2.5 text-sm"
          />

          <PasswordField register={register} watch={watch} errors={errors} />

          <button
            type="submit"
            className={`w-full cursor-pointer rounded-md bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 ${
              isLoading ? 'cursor-not-allowed bg-gray-400' : ''
            }`}
          >
            {isLoading ? <Loader2 className="mx-auto animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
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
              label: 'Sign up with Google',
            },
          ].map(({ provider, icon, label }) => (
            <button
              key={provider}
              onClick={() => handleOAuthLogin(provider)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-gray-100 bg-transparent py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50"
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
