#!/usr/bin/env node

/**
 * Script to fetch existing Stripe prices or create new ones
 * Run this to get your actual Stripe price IDs
 */

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function main() {
  try {
    console.log('Fetching Stripe products and prices...\n');
    
    // First, try to find existing products
    const products = await stripe.products.list({ limit: 100 });
    
    let weddingProduct = products.data.find(p => 
      p.name?.toLowerCase().includes('wedding') || 
      p.name?.toLowerCase().includes('professional') ||
      p.name?.toLowerCase().includes('uptune')
    );
    
    if (!weddingProduct) {
      console.log('No wedding product found. Creating one...');
      
      // Create a product
      weddingProduct = await stripe.products.create({
        name: 'Uptune Wedding Professional',
        description: 'Complete wedding music planning toolkit with unlimited songs, AI recommendations, and Spotify export',
      });
      
      console.log(`Created product: ${weddingProduct.id}\n`);
    } else {
      console.log(`Found existing product: ${weddingProduct.id} - ${weddingProduct.name}\n`);
    }
    
    // Fetch existing prices for this product
    const prices = await stripe.prices.list({
      product: weddingProduct.id,
      limit: 100
    });
    
    // Look for existing prices
    let gbpPrice = prices.data.find(p => p.currency === 'gbp' && p.unit_amount === 2500);
    let usdPrice = prices.data.find(p => p.currency === 'usd' && p.unit_amount === 2500);
    let eurPrice = prices.data.find(p => p.currency === 'eur' && p.unit_amount === 2500);
    
    // Create missing prices
    if (!gbpPrice) {
      console.log('Creating GBP price...');
      gbpPrice = await stripe.prices.create({
        product: weddingProduct.id,
        unit_amount: 2500, // £25.00
        currency: 'gbp',
      });
    }
    
    if (!usdPrice) {
      console.log('Creating USD price...');
      usdPrice = await stripe.prices.create({
        product: weddingProduct.id,
        unit_amount: 2500, // $25.00
        currency: 'usd',
      });
    }
    
    if (!eurPrice) {
      console.log('Creating EUR price...');
      eurPrice = await stripe.prices.create({
        product: weddingProduct.id,
        unit_amount: 2500, // €25.00
        currency: 'eur',
      });
    }
    
    console.log('\n=== YOUR STRIPE PRICE IDs ===\n');
    console.log(`GBP Price ID: ${gbpPrice.id} (£${gbpPrice.unit_amount / 100})`);
    console.log(`USD Price ID: ${usdPrice.id} ($${usdPrice.unit_amount / 100})`);
    console.log(`EUR Price ID: ${eurPrice.id} (€${eurPrice.unit_amount / 100})`);
    
    console.log('\n=== ADD THESE TO YOUR .env.local ===\n');
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_GBP=${gbpPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_USD=${usdPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_EUR=${eurPrice.id}`);
    
    console.log('\n=== OR UPDATE src/config/stripe-prices.ts ===\n');
    console.log(`GBP: process.env.NEXT_PUBLIC_STRIPE_PRICE_GBP || '${gbpPrice.id}',`);
    console.log(`USD: process.env.NEXT_PUBLIC_STRIPE_PRICE_USD || '${usdPrice.id}',`);
    console.log(`EUR: process.env.NEXT_PUBLIC_STRIPE_PRICE_EUR || '${eurPrice.id}'`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('api_key')) {
      console.error('\nMake sure STRIPE_SECRET_KEY is set in your .env.local file');
    }
  }
}

main();