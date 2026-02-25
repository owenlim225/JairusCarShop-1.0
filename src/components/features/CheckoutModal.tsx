'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { createOrder } from '@/lib/supabase/orders'
import type { CheckoutForm } from '@/types'

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialForm: CheckoutForm = { name: '', address: '', phone: '' }

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, subtotal, clearCart, sessionId } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof CheckoutForm, string>> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.address.trim()) next.address = 'Address is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return
      setSubmitting(true)
      setSubmitError(null)
      const result = await createOrder({
        sessionId: sessionId ?? null,
        form,
        items,
        total: subtotal,
      })
      setSubmitting(false)
      if (!result.ok) {
        setSubmitError(result.error ?? 'Failed to place order')
        return
      }
      await clearCart()
      setSuccess(true)
    },
    [validate, sessionId, form, items, subtotal, clearCart]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        if (success) {
          clearCart()
          setForm(initialForm)
          setSuccess(false)
        }
        setErrors({})
      }
      onOpenChange(open)
    },
    [success, clearCart, onOpenChange]
  )

  const update = useCallback((field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const isEmpty = items.length === 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        title="Checkout"
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        aria-describedby="checkout-description"
      >
        <DialogHeader>
          <DialogTitle id="checkout-dialog-title">
            {success ? 'Order confirmed' : 'Checkout'}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-4"
            >
              <p id="checkout-description" className="text-muted-foreground">
                Thank you, {form.name}. Your order has been received. We will
                contact you at {form.phone || 'your provided contact'}.
              </p>
              <Button onClick={() => handleOpenChange(false)} className="w-full">
                Close
              </Button>
            </motion.div>
          ) : isEmpty ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 text-muted-foreground"
            >
              Your cart is empty. Add items before checkout.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 py-2"
            >
              <div className="space-y-2">
                <Label htmlFor="checkout-name">Name *</Label>
                <Input
                  id="checkout-name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Full name"
                  aria-required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'checkout-name-error' : undefined}
                />
                {errors.name && (
                  <p id="checkout-name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-address">Address *</Label>
                <Input
                  id="checkout-address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Delivery address"
                  aria-required
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? 'checkout-address-error' : undefined}
                />
                {errors.address && (
                  <p id="checkout-address-error" className="text-sm text-destructive">
                    {errors.address}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-phone">Phone (optional)</Label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="09XX XXX XXXX"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="mb-2 text-sm font-medium">Order summary</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {items.map((i) => (
                    <li key={i.id}>
                      {i.model} × {i.quantity} — {formatPrice(i.price * i.quantity)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">
                  Total: {formatPrice(subtotal)}
                </p>
              </div>

              {submitError && (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              )}

              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Placing order…' : 'Confirm order'}
                </Button>
              </DialogFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
