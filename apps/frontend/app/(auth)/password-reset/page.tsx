'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Link from 'next/link'
import axiosInstance from '@/utils/axiosInstance'

const PasswordReset = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { email: '' },
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const onSubmit = async (data: any) => {
    try {
      const res = await axiosInstance.post('/auth/forgot-password', data)
      console.log('res: ', res)

      if (res.data.error) {
        // API returned an error -> show error message
        setErrorMessage(res.data.error.message || 'Something went wrong')
        setSuccessMessage('') // Clear success message in case of error
      } else {
        // API call succeeded -> show success message
        setSuccessMessage(
          'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
        )
        setIsDisabled(true)
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              setIsDisabled(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        setErrorMessage('') // Clear error message
        reset() // Reset form
      }
    } catch (err) {
      console.log('error: ', err)
      setErrorMessage('Something went wrong, please try again.')
      setSuccessMessage('') // Clear success message on error
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-125 flex-col items-center justify-center rounded bg-white p-6 shadow-md"
      >
        {successMessage && (
          <div className="py-4.5xt-center relative mx-auto mb-4 w-full rounded border border-green-400 bg-green-100 px-4 text-green-700">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="relative mx-auto mb-4 w-full rounded border border-red-400 bg-red-100 px-4 py-4.5 text-center text-red-700">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <h2 className="mb-4 text-[16px] font-medium">
          Enter your user account&apos;s verified email address and we will send you a password reset link.
        </h2>

        <Input
          type="text"
          name="email"
          placeholder="Email address"
          control={control}
          validation={{ required: 'Email is required' }}
          className="py-4"
        />

        <Button
          type="submit"
          disabled={isDisabled}
          className={`bg-primary mt-4 w-full rounded py-3 text-white ${
            isDisabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isDisabled ? `Resend in ${countdown}s` : 'Send reset link'}
        </Button>
        <Link className="mt-4 hover:underline" href={'/sign-in'}>
          Return to sign in
        </Link>
      </form>
    </div>
  )
}

export default PasswordReset
