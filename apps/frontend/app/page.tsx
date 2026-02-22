'use client'
import { RequireAuth } from '@/providers/HOC/RequireAuth'
import { HeroSection } from '@/app/(public)/(home)/HeroSection'
function Home() {
  return (
    <div>
      <HeroSection isPreview={false} />
    </div>
  )
}
export default Home
