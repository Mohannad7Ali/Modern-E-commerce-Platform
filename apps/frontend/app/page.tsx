'use client'
import { RequireAuth } from '@/providers/HOC/RequireAuth'
import { HeroSection } from '@/app/(public)/(home)/HeroSection'
import CategoryBar from '@/app/(public)/(home)/CategoryBar'
function Home() {
  return (
    <div>
      <HeroSection isPreview={false} />
      <CategoryBar />
    </div>
  )
}
export default Home
