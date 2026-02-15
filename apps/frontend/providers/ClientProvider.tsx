'use client'

import { ReactNode } from 'react'
import StoreProvider from './StoreProvider'
import AuthProvider from './AuthProvider'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider> {children}</AuthProvider>
    </StoreProvider>
  )
}
