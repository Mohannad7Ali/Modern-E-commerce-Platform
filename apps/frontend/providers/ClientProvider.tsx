'use client'

import { ReactNode } from 'react'
import StoreProvider from './StoreProvider'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}
