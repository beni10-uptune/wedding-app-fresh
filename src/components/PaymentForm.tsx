'use client'

import { useState } from 'react'
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import stripePromise, { STRIPE_CONFIG } from '@/lib/stripe'
import { CreditCard, Lock } from 'lucide-react'

interface PaymentFormProps {
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ onSuccess, onError }: Omit<PaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?wedding_id=${new URLSearchParams(window.location.search).get('wedding_id') || window.location.pathname.split('/')[2]}`,
      },
      redirect: 'if_required'
    })

    if (error) {
      onError(error.message || 'Payment failed')
      setIsProcessing(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-darker rounded-xl p-6 border border-white/20">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-white/60">
        <Lock className="w-4 h-4" />
        <span>Your payment info is secure and encrypted</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-primary w-full"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay Now
          </>
        )}
      </button>
    </form>
  )
}

export default function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#a855f7',
            colorBackground: '#1e293b',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}