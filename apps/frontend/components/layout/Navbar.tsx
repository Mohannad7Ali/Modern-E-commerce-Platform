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
    if (!window) return
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
            <Link href="/" className="flex-shrink-0 text-lg font-medium text-gray-900 sm:text-xl lg:text-xl">
              Ecommerce
            </Link>

            {/* Desktop Search Bar */}
            <div className="mx-8 hidden max-w-lg flex-1 md:flex">
              <SearchBar />
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-gray-700 transition-colors hover:text-indigo-600 md:hidden"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 transition-colors hover:text-indigo-600"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="text-[20px] sm:text-[22px]" />
                {cartData?.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-medium text-white">
                    {cartData?.cartCount > 99 ? '99+' : cartData?.cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {!isLoading && isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center rounded-full p-1 transition-colors hover:bg-gray-100"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <div className="h-7 w-7 overflow-hidden rounded-full border border-gray-300 bg-gray-200">
                        <Image
                          src={avatarSrc}
                          alt="User Profile"
                          width={28}
                          height={28}
                          className="h-full w-full rounded-full object-cover"
                          onError={e => {
                            e.currentTarget.src = avatarSrc
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-[35px] w-[35px] overflow-hidden rounded-full border border-gray-300">
                        <Image
                          src={avatarSrc}
                          alt="User Profile"
                          width={35}
                          height={35}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    )}
                  </button>

                  {menuOpen && <UserMenu user={user} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />}
                </div>
              ) : (
                pathname !== '/sign-up' &&
                pathname !== '/sign-in' && (
                  <Link
                    href="/sign-in"
                    className="hidden px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:text-indigo-600 sm:block"
                  >
                    Sign in
                  </Link>
                )
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 transition-colors hover:text-indigo-600 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="border-t border-gray-200 py-3 md:hidden">
              <SearchBar />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="absolute top-full right-0 left-0 border-t border-gray-200 bg-white shadow-lg md:hidden"
            >
              <div className="space-y-2 px-4 py-2">
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/sign-in"
                      className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/orders"
                  className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  href="/shop"
                  className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50/80"
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
