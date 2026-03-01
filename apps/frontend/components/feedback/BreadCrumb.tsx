'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const BreadCrumb: React.FC = () => {
  const pathname = usePathname() // get current page url
  const pathSegments = pathname.split('/').filter(Boolean) // split url in array and filter empty elements

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500 sm:space-x-2">
        <li>
          <Link href="/" className="font-medium transition hover:text-indigo-600">
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // build urls each part we group all last and join it with /
          const href = '/' + pathSegments.slice(0, index + 1).join('/')
          const isLast = index === pathSegments.length - 1 // we check if it is the last because it isnot link it represent current page

          return (
            // because add element cause problems in style so framgment save us
            <React.Fragment key={href}>
              <span className="text-gray-400">/</span>
              <li>
                {isLast ? (
                  <span className="font-semibold capitalize">{decodeURIComponent(segment)}</span>
                ) : (
                  <Link href={href} className="font-medium capitalize transition hover:text-indigo-600">
                    {
                      decodeURIComponent(segment) //to convert sympol in url to readable text
                    }
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadCrumb
