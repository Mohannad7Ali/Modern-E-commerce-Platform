import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Send, Users, Shield, Truck } from 'lucide-react'
import Link from 'next/link'

const FooterLogo = () => (
  <svg viewBox="0 0 120 40" className="h-10">
    <text x="0" y="28" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="currentColor">
      Swift
    </text>
  </svg>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // // Fetch real categories data
  // const { data: categoriesData } = useQuery(GET_CATEGORIES)
  // const categories = categoriesData?.categories || []

  // Get top 6 categories for footer
  // const footerCategories = categories.slice(0, 6)

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-950 pt-16 pb-8 text-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="max-w-8xl relative z-10 mx-auto px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 border-b border-gray-800/80 pb-16 lg:grid-cols-6">
          {/* Logo and description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center">
              <div className="mr-5 text-white">
                <FooterLogo />
              </div>
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <span className="ml-2 text-sm font-medium tracking-wider text-gray-400 uppercase">Premium Store</span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-gray-400">
              Discover high-quality products at Commerce. Shop with confidence and enjoy premium selections tailored
              just for you. Fast shipping, secure payments, and exceptional customer service.
            </p>

            <div className="mt-8 flex flex-col space-y-4">
              <div className="flex items-start">
                <MapPin size={18} className="mt-0.5 mr-3 flex-shrink-0 text-indigo-400" />
                <p className="text-sm text-gray-400">123 Tartous Commerce Street, Shopping District, 10001</p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0 text-indigo-400" />
                <p className="text-sm text-gray-400">+369 980 663 670</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0 text-indigo-400" />
                <p className="text-sm text-gray-400">support@Ecommerce.com</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="mx-auto mb-2 h-6 w-6 text-indigo-400" />
                <p className="text-xs text-gray-400">Fast Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-6 w-6 text-indigo-400" />
                <p className="text-xs text-gray-400">Secure Payment</p>
              </div>
              <div className="text-center">
                <Users className="mx-auto mb-2 h-6 w-6 text-indigo-400" />
                <p className="text-xs text-gray-400">24/7 Support</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {/* Categories */}
              <div>
                <h3 className="relative mb-6 inline-block text-lg font-semibold text-white">
                  Categories
                  <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
                </h3>
                {/* <ul className="space-y-3">
                  {footerCategories.map(category => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?categoryId=${category.id}`}
                        className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                      >
                        <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  {categories.length > 6 && (
                    <li>
                      <Link
                        href="/shop"
                        className="group flex items-center text-sm text-indigo-400 transition-all duration-200 hover:text-indigo-300"
                      >
                        <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                        View All Categories
                      </Link>
                    </li>
                  )}
                </ul> */}
              </div>

              {/* Company */}
              <div>
                <h3 className="relative mb-6 inline-block text-lg font-semibold text-white">
                  Company
                  <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/press"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Press
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="relative mb-6 inline-block text-lg font-semibold text-white">
                  Support
                  <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/help"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/returns"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track-order"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Track Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/size-guide"
                      className="group flex items-center text-sm text-gray-400 transition-all duration-200 hover:text-white"
                    >
                      <span className="mr-0 h-1 w-0 rounded-full bg-indigo-500 transition-all duration-200 group-hover:mr-2 group-hover:w-2"></span>
                      Size Guide
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="relative mb-6 inline-block text-lg font-semibold text-white">
              Stay Updated
              <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-indigo-500"></span>
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Subscribe to get exclusive offers, new product updates, and special discounts.
            </p>
            <form className="space-y-3" onSubmit={e => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 p-3 pr-12 pl-4 text-sm text-white transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md bg-indigo-600 p-1.5 text-white transition-colors hover:bg-indigo-700"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500">By subscribing, you agree to our Privacy Policy.</p>
            </form>

            <div className="mt-8">
              <h4 className="mb-4 text-sm font-medium text-gray-300">Follow Us</h4>
              <div className="flex space-x-3">
                {[
                  {
                    icon: <Facebook size={18} />,
                    name: 'Facebook',
                    bg: 'bg-blue-600',
                    href: 'https://facebook.com/ss-commerce',
                  },
                  {
                    icon: <Twitter size={18} />,
                    name: 'Twitter',
                    bg: 'bg-sky-500',
                    href: 'https://twitter.com/ss-commerce',
                  },
                  {
                    icon: <Instagram size={18} />,
                    name: 'Instagram',
                    bg: 'bg-pink-600',
                    href: 'https://instagram.com/ss-commerce',
                  },
                  {
                    icon: <Youtube size={18} />,
                    name: 'YouTube',
                    bg: 'bg-red-600',
                    href: 'https://youtube.com/ss-commerce',
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`${social.bg} rounded-full p-2.5 text-white transition-all duration-200 hover:scale-110 hover:opacity-90`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods and copyright */}
        <div className="flex flex-col items-center justify-between pt-8 md:flex-row">
          <div className="mb-6 flex items-center space-x-6 md:mb-0">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Stripe'].map((method, idx) => (
              <div key={idx} className="text-xs font-medium text-gray-500">
                {method}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-2 text-center text-sm md:flex-row md:space-y-0 md:space-x-8 md:text-left">
            <p className="text-gray-400">© {currentYear} Premium ECommerce. All rights reserved.</p>
            <div className="flex space-x-4 text-gray-500">
              {[
                { name: 'Terms', href: '/terms' },
                { name: 'Privacy', href: '/privacy' },
                { name: 'Cookies', href: '/cookies' },
                { name: 'Sitemap', href: '/sitemap' },
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="transition-colors hover:text-white">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
