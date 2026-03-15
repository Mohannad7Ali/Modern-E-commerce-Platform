'use client'
import { useEffect, useRef } from 'react'
import { X, Check, Info, AlertTriangle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeToast } from '../../store/slices/ToastSlice'
const toastVariants = {
  success: {
    icon: <Check size={18} />,
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600',
    textColor: 'text-white',
  },
  error: {
    icon: <X size={18} />,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600',
    textColor: 'text-white',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-600',
    textColor: 'text-white',
  },
  info: {
    icon: <Info size={18} />,
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-600',
    textColor: 'text-white',
  },
}
const Toast = () => {
  const dispatch = useAppDispatch()
  const { toasts } = useAppSelector(state => state.toasts)
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({}) // we use ref to store timer without it we will lose timer in each render
  // ref keep its value during the whole lifecycle of the component and doesn't cause re-render when its value changes
  useEffect(() => {
    toasts.forEach(toast => {
      //if there isnot any property with this id we add id with timer
      if (!timeoutRefs.current[toast.id]) {
        const timeoutId = setTimeout(() => {
          dispatch(removeToast(toast.id))
          delete timeoutRefs.current[toast.id]
        }, 2500)
        timeoutRefs.current[toast.id] = timeoutId
      }
    })
    // return cleanup function to clean up timers when component unmounts or toasts change before useEffect work again
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout)
      timeoutRefs.current = {}
    }
  }, [toasts, dispatch])
  const handleClose = (id: string) => {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]) // cancel timer in event loop so its code never run but it still exist but cancelled
      delete timeoutRefs.current[id] // delete in js to remove property from object and free memory
    }
    dispatch(removeToast(id))
  }
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map(toast => {
        const variant = toastVariants[toast.type] || toastVariants.info

        return (
          <div
            key={toast.id}
            className={`flex w-72 items-center gap-3 rounded-lg border-l-4 p-3 shadow-lg ${variant.borderColor} animate-slideIn bg-white backdrop-blur-md`}
            style={{
              animation: 'slideIn 0.3s ease-out forwards',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${variant.bgColor} ${variant.textColor}`}
            >
              {variant.icon}
            </div>

            <div className="mr-2 flex-1">
              {toast.type && <p className="text-sm font-medium text-gray-800">{toast.type}</p>}
              <p className="text-sm text-gray-600">{toast.message}</p>
            </div>

            <button
              onClick={() => handleClose(toast.id)}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
