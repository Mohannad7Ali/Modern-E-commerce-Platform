import { useEffect, useState } from 'react'

type StorageType = 'local' | 'session'
function useStorage<T>(key: string, initialValue: T, storageType: StorageType) {
  const isClient = typeof window !== 'undefined'
  const storage = isClient ? (storageType === 'local' ? window.localStorage : window.sessionStorage) : null
  const getStoredValue = (): T => {
    if (isClient && storage) {
      try {
        const item = storage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      } catch (error) {
        console.error(`Error retrieving value from ${storageType} storage:`, error)
        return initialValue
      }
      return initialValue
    }
  }
  const [storedValue, setStoredValue] = useState<T>(getStoredValue())
  useEffect(() => {
    if (!isClient || !storage) return
    try {
      storage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error saving value to ${storageType} storage:`, error)
    }
  }, [key, storedValue, storage, isClient])
  return [storedValue, setStoredValue] as const
}
export default useStorage
