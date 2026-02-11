'use client' // Directive to indicate this hook runs only on the client side
import { useEffect } from 'react'

/**
 * Custom hook that triggers a callback when a click or touch occurs outside of the referenced element.
 * Supports both desktop (mouse) and mobile (touch) interactions.
 * @param ref - React ref object pointing to the element to monitor.
 * @param callback - Function to execute when an outside click is detected.
 */
const useClickOutside = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
  useEffect(() => {
    // The handler function for both mouse and touch events
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Ensure the ref is assigned and the click/touch target is not inside the element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback() // Execute the callback if the interaction is outside
      }
    }

    // Add listeners for mouse clicks and finger touches
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup function to remove listeners and prevent memory leaks
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, callback]) // Effect dependencies
}

export default useClickOutside
