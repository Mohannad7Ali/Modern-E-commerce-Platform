/**
 * in react, functions was born and die each render
 * and each time browser need to get new memory address for this function and that is expensive
 * we use useRef here to store callback in Static Memory Reference whatever this callback changes the box address is static
 * in this case browser doesn't feel any things the event listner  binded with this static wrapper
 * why:
 * in production maybe we have so many eventlistners and if for each one do rebind in each render this will make jank and slow in performance
 */
'use client'
import { useEffect, useRef } from 'react'

/**
 * Custom hook to manage event listeners with performance optimization.
 * This pattern ensures that the event listener is not re-attached
 * unnecessarily when the callback function changes.
 */
function useEventListener<E extends keyof WindowEventMap>(
  eventType: E,
  callback: (event: WindowEventMap[E]) => void,
  element?: HTMLElement | Window | Document,
) {
  // * Store the callback in a ref to avoid creating a new function on every render
  // CREATE A STABLE BOX (REF)
  // We use useRef to keep the same memory reference for the callback
  // throughout the entire lifecycle of the component.
  const callbackRef = useRef(callback)

  // 2. KEEP THE BOX UPDATED
  // Every time the component re-renders, this effect runs to ensure
  // our "Stable Box" always contains the latest logic from the callback.
  // This DOES NOT trigger the event listener to re-attach.
  useEffect(() => {
    callbackRef.current = callback
  })

  // 3. ATTACH THE ACTUAL BROWSER LISTENER
  // This effect runs ONLY when the 'eventType' or 'element' changes.
  useEffect(() => {
    // Determine the target (defaults to window if no element is passed)
    const targetElement = element ?? window

    // Safety check for Server-Side Rendering (SSR)
    if (!targetElement || !targetElement.addEventListener) return

    // A static wrapper function that always calls the latest logic inside our Ref
    const eventListener = (event: Event) => callbackRef.current(event as WindowEventMap[E])

    // Add the listener to the DOM
    targetElement.addEventListener(eventType, eventListener)

    // 4. THE CLEANUP PHASE
    // When the component unmounts (destroyed), we remove the listener
    // to prevent "Memory Leaks" and keep the app fast.
    return () => targetElement.removeEventListener(eventType, eventListener)
  }, [eventType, element])
  // Note: 'callback' is NOT in the dependencies above,
  // which is how we avoid re-attaching on every render.
}

export default useEventListener
