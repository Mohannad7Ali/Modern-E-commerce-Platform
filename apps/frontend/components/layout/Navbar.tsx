'use client'

import useEventListener from '@/hooks/dom/useEventListner'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import useClickOutside from '@/hooks/dom/useClickOutside'
import SearchBar from '../molecules/SearchBar'
import { ShoppingCart, Menu, X, Search, LogOut } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { generateUserAvatar } from '@/utils/placeholderImages'
import Image from 'next/image'
import UserMenu from '../molecules/UserMenu'
import { useSignOutMutation } from '@/store/apis/AuthApi'
import { logout } from '@/store/slices/AuthSlice'
import { useAuth } from '@/hooks/useAuth'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, isLoading, isAuthenticated } = useAuth()

  useClickOutside(menuRef, () => setMenuOpen(false))
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false))

  const [signout] = useSignOutMutation()

  const avatarSrc = useMemo(() => {
    if (user?.avatar) return user.avatar
    return generateUserAvatar(user?.name || 'User')
  }, [user])

  const handleSignOut = async () => {
    try {
      await signout()
      dispatch(logout())
      router.push('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const cartData = { cartCount: 20 }

  useEventListener('scroll', () => {
    if (typeof window !== 'undefined') {
      setScrolled(window.scrollY > 20)
    }
  })

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white py-2 shadow-md' : 'bg-white/95 py-3 backdrop-blur-sm sm:py-4'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 text-lg font-bold text-indigo-600 sm:text-xl lg:text-2xl">
              STORE
            </Link>

            {/* Desktop Search Bar */}
            <div className="mx-8 hidden max-w-lg flex-1 md:flex">
              <SearchBar />
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-gray-700 transition-colors hover:text-indigo-600 md:hidden"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/cart"
                className="relative p-2 text-gray-700 transition-colors hover:text-indigo-600"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} />
                {cartData?.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartData?.cartCount > 99 ? '99+' : cartData?.cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu with Circle Ring Avatar */}
              {!isLoading && isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="group relative flex items-center justify-center focus:outline-none"
                    aria-label="User menu"
                  >
                    <div
                      className={`relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-indigo-500/50 ${menuOpen ? 'ring-indigo-600' : ''} `}
                    >
                      <Image
                        src={avatarSrc}
                        alt="User Profile"
                        fill
                        className="object-cover"
                        sizes="40px"
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.src = generateUserAvatar(user?.name || 'User')
                        }}
                      />
                    </div>
                    <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </button>

                  {menuOpen && <UserMenu user={user} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />}
                </div>
              ) : (
                !isAuthenticated &&
                pathname !== '/sign-up' &&
                pathname !== '/sign-in' && (
                  <Link
                    href="/sign-in"
                    className="hidden rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 sm:block"
                  >
                    Sign in
                  </Link>
                )
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 transition-colors hover:text-indigo-600 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="border-t border-gray-100 py-3 md:hidden">
              <SearchBar />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="animate-in slide-in-from-top-2 absolute top-full right-0 left-0 border-t border-gray-100 bg-white p-4 shadow-xl duration-200 md:hidden"
            >
              <div className="flex flex-col space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div className="mb-2 flex items-center space-x-3 border-b border-gray-100 pb-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-indigo-100">
                      <Image src={avatarSrc} alt="User" width={40} height={40} className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                )}

                <Link
                  href="/"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/orders"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}

export default Navbar
