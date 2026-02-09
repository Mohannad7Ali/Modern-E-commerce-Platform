import useEventListener from '@/hooks/dom/useEventListner'
import Link from 'next/link'
import { useEffect, useState } from 'react'
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  useEventListener(
    'scroll',
    () => {
      setScrolled(window.scrollY > 20)
    },
    window,
  )
  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white py-2 shadow-md' : 'sm:py4 bg-white/95 py-3 backdrop-blur-sm'}`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between sm:h-16">
            {/* logo */}
            <Link href="/" className="flex-shrink-0 text-lg font-medium text-gray-900 sm:text-xl lg:text-xl">
              SwiftCart
            </Link>
            {/* Descktop search bar */}
            <div className="mx-8 flex hidden max-w-lg md:flex"></div>
          </div>
        </nav>
      </header>
    </>
  )
}
export default Navbar
