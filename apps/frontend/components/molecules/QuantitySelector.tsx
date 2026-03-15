'use client'
import { Minus, Plus } from 'lucide-react'
import { useUpdateCartItemMutation } from '@/store/apis/CartApi'
import Button from '../atoms/Button'
import useToast from '@/hooks/ui/useToast'

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  itemId: string
}

const QuantitySelector = ({ value, onChange, itemId }: QuantitySelectorProps) => {
  const { showToast } = useToast()
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation()

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === value) return

    onChange(newQty) // update form state
    try {
      await updateCartItem({ id: itemId, quantity: newQty }).unwrap()
    } catch (err) {
      showToast((err as any).data?.message || 'Failed to update quantity', 'error')
      onChange(value)
    }
  }

  return (
    <div className="flex max-w-fit items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1">
      <Button
        type="button"
        onClick={() => handleUpdate(value - 1)}
        disabled={isLoading || value <= 1}
        className="rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <Minus size={16} />
      </Button>

      <span className="min-w-[32px] text-center font-semibold text-gray-800">{value}</span>

      <Button
        type="button"
        onClick={() => handleUpdate(value + 1)}
        disabled={isLoading}
        className="rounded-full p-2 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <Plus size={16} />
      </Button>
    </div>
  )
}

export default QuantitySelector
