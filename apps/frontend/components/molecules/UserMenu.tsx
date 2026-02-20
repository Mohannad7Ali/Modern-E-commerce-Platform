'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Home, User, LogOut, ShoppingCart, ChevronRight, Group } from 'lucide-react'
import { useSignOutMutation } from '@/store/apis/AuthApi'
import useClickOutside from '@/hooks/dom/useClickOutside'
import useEventListener from '@/hooks/dom/useEventListner'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/AuthSlice'
import { UserData } from '@/types/authTypes'
import { Variants } from 'framer-motion'

interface UserMenuProps {
  user: UserData | null | undefined
  menuOpen: boolean
  closeMenu: () => void
}
const UserMenu = ({ menuOpen, closeMenu, user }: UserMenuProps) => {
  const [signout] = useSignOutMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const menuRef = useRef(null)

  useClickOutside(menuRef, () => closeMenu())

  useEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) {
      closeMenu()
    }
  })

  const handleSignOut = async () => {
    try {
      await signout()
      dispatch(logout())
      router.push('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const menuItems = [
    {
      routes: [
        {
          href: '/',
          label: 'Home',
          icon: <Home size={18} className="text-indigo-500" />,
          show: true,
        },
        {
          href: '/orders',
          label: 'My Orders',
          icon: <ShoppingCart size={18} className="text-emerald-500" />,
          show: true,
        },
        {
          href: '/profile',
          label: 'Profile',
          icon: <User size={18} className="text-blue-500" />,
          show: true,
        },
        {
          href: '/support',
          label: 'Contact Support',
          icon: <Group size={18} className="text-blue-500" />,
          show: true,
        },
      ],
    },
    {
      routes: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={18} className="text-purple-500" />,
          show: user?.role === 'ADMIN' || user?.role === 'SUPERADMIN',
        },
      ],
    },
  ]

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.15, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.1, ease: 'easeIn' },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="absolute top-12 right-0 z-50 w-64 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="absolute top-[-8px] right-4 h-4 w-4 rotate-45 transform border-t border-l border-gray-100 bg-white" />

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-2">
            {menuItems.map((section, sectionIndex) => {
              const visibleRoutes = section.routes.filter(route => route.show)
              if (visibleRoutes.length === 0) return null

              return (
                <div key={sectionIndex} className="mb-2 last:mb-0">
                  {visibleRoutes.map(route => (
                    <motion.div key={route.href} variants={itemVariants}>
                      <Link
                        href={route.href}
                        className="group relative flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50/80"
                        onClick={closeMenu}
                      >
                        <span className="flex-shrink-0">{route.icon}</span>
                        <span className="flex-1">{route.label}</span>
                        <ChevronRight
                          size={16}
                          className="text-gray-300 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <span className="absolute top-0 bottom-0 left-0 w-0.5 bg-transparent transition-all duration-200 group-hover:bg-indigo-500" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )
            })}
          </div>

          <motion.div variants={itemVariants} className="mt-1 border-t border-gray-100">
            <button
              onClick={() => {
                handleSignOut()
                closeMenu()
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50/80"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserMenu
