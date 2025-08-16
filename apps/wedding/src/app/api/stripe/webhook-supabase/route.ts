import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { logger, logError } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      logError(err, { context: 'Webhook signature verification failed' })
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('Payment succeeded', { paymentIntentId: paymentIntent.id })
        
        // Extract metadata
        const { weddingId, userId, email, tier } = paymentIntent.metadata

        if (!weddingId || !userId) {
          logger.error('Missing metadata in payment intent', { paymentIntentId: paymentIntent.id })
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        try {
          // Update wedding payment status
          const { error } = await supabase
            .from('wedding_weddings')
            .update({
              payment_tier: tier || 'starter',
              payment_status: 'active',
              stripe_subscription_id: paymentIntent.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', weddingId)

          if (error) throw error

          // Update user's subscription if needed
          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier || 'starter',
              subscription_status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          // Create activity
          await supabase.rpc('create_activity', {
            p_app_name: 'wedding',
            p_activity_type: 'payment_succeeded',
            p_title: `Upgraded to ${tier || 'Starter'} plan`,
            p_reference_type: 'wedding',
            p_reference_id: weddingId,
            p_is_public: false
          })

          logger.info('Wedding marked as paid', { weddingId, paymentIntentId: paymentIntent.id })
        } catch (error) {
          logError(error, { context: 'Error updating wedding payment status', weddingId })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('Payment failed', { paymentIntentId: paymentIntent.id })
        
        const { weddingId } = paymentIntent.metadata

        if (weddingId) {
          logger.warn('Payment failed for wedding', { weddingId, paymentIntentId: paymentIntent.id })
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        logger.info('Checkout session completed', { sessionId: session.id })
        
        if (session.metadata?.weddingId && session.metadata?.userId) {
          try {
            const { error } = await supabase
              .from('wedding_weddings')
              .update({
                payment_tier: session.metadata.tier || 'starter',
                payment_status: 'active',
                stripe_subscription_id: session.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', session.metadata.weddingId)

            if (error) throw error

            logger.info('Wedding updated from checkout session', { 
              weddingId: session.metadata.weddingId,
              sessionId: session.id 
            })
          } catch (error) {
            logError(error, { context: 'Error updating wedding from checkout', sessionId: session.id })
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        logger.info('Subscription event', { 
          type: event.type,
          subscriptionId: subscription.id 
        })

        const customerId = subscription.customer as string
        
        try {
          // Get customer from Stripe
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
          
          if (customer.email) {
            // Update user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customer.email)
              .single()

            if (profile) {
              // Determine tier from subscription
              let tier = 'free'
              const priceId = subscription.items.data[0]?.price.id
              if (priceId) {
                // Map price IDs to tiers (you'll need to update these)
                if (priceId.includes('starter')) tier = 'starter'
                else if (priceId.includes('professional')) tier = 'professional'
                else if (priceId.includes('ultimate')) tier = 'ultimate'
              }

              await supabase
                .from('profiles')
                .update({
                  stripe_customer_id: customerId,
                  subscription_tier: tier,
                  subscription_status: subscription.status,
                  updated_at: new Date().toISOString()
                })
                .eq('id', profile.id)

              // Update all weddings for this user
              await supabase
                .from('wedding_weddings')
                .update({
                  payment_tier: tier,
                  payment_status: subscription.status,
                  stripe_subscription_id: subscription.id,
                  updated_at: new Date().toISOString()
                })
                .eq('owner_id', profile.id)

              logger.info('Subscription updated for user', { 
                userId: profile.id,
                tier,
                status: subscription.status 
              })
            }
          }
        } catch (error) {
          logError(error, { context: 'Error handling subscription event', subscriptionId: subscription.id })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        logger.info('Subscription cancelled', { subscriptionId: subscription.id })

        const customerId = subscription.customer as string
        
        try {
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
          
          if (customer.email) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', customer.email)
              .single()

            if (profile) {
              // Downgrade to free tier
              await supabase
                .from('profiles')
                .update({
                  subscription_tier: 'free',
                  subscription_status: 'cancelled',
                  updated_at: new Date().toISOString()
                })
                .eq('id', profile.id)

              // Update weddings to free tier
              await supabase
                .from('wedding_weddings')
                .update({
                  payment_tier: 'free',
                  payment_status: 'cancelled',
                  updated_at: new Date().toISOString()
                })
                .eq('owner_id', profile.id)

              logger.info('Subscription cancelled for user', { userId: profile.id })
            }
          }
        } catch (error) {
          logError(error, { context: 'Error handling subscription cancellation', subscriptionId: subscription.id })
        }
        break
      }

      default:
        logger.info('Unhandled webhook event type', { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logError(error, { context: 'Webhook handler error' })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}