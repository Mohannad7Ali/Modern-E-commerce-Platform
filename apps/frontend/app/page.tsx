'use client'
import { RequireAuth } from '@/providers/HOC/RequireAuth'

function Home() {
  return <div>Ecommerce</div>
}
export default RequireAuth(Home)
