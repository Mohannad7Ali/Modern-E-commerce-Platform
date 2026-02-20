'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { useResetPasswordMutation } from '@/store/apis/AuthApi'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PasswordResetWithToken = () => {
  const router = useRouter()
  const { handleSubmit, control } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { token } = useParams()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const onSubmit = async (formData: { password: string; confirmPassword: string }) => {
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      setIsError(true)
      return
    }

    try {
      await resetPassword({
        token: token as string,
        newPassword: formData.password,
      }).unwrap()
      setMessage('Password reset successful! You can now log in.')
      setIsError(false)
      setTimeout(() => {
        router.replace('/sign-in')
      }, 2000)
    } catch {
      setMessage('Something went wrong')
      setIsError(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[500px] flex-col items-center justify-center gap-4 rounded bg-white p-6 shadow-md"
      >
        <h1 className="mb-4 text-2xl font-bold">Reset Your Password</h1>

        {message && (
          <div
            className={`mb-4 w-full rounded py-[22px] text-center ${
              isError ? 'border-2 border-red-400 bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <Input
          type="password"
          name="password"
          placeholder="New Password"
          control={control}
          validation={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          }}
          className="py-4"
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          control={control}
          validation={{ required: 'Confirm your password' }}
          className="py-4"
        />

        <Button type="submit" className="bg-primary mt-4 w-full rounded py-[12px] text-white" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <Link className="mt-4 hover:underline" href={'/sign-in'}>
          Return to sign in
        </Link>
      </form>
    </div>
  )
}

export default PasswordResetWithToken
