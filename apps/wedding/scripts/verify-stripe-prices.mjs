#!/usr/bin/env node

import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function verifyPrices() {
  const priceIds = [
    'price_1RvhMAGgCOR544BuRjcIaU3R', // GBP
    'price_1RvhMBGgCOR544Bu0ShSQ205', // USD
    'price_1RiKH6GgCOR544BuaQIQC8rI'  // EUR
  ];
  
  console.log('Verifying Stripe Price IDs from your account...\n');
  
  for (const priceId of priceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(`✅ ${price.currency.toUpperCase()}: ${priceId}`);
      console.log(`   Amount: ${price.unit_amount / 100} ${price.currency}`);
      console.log(`   Product: ${price.product}`);
      console.log(`   Active: ${price.active}\n`);
    } catch (error) {
      console.log(`❌ ${priceId}: NOT FOUND or ERROR`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
  
  // Also check what mode we're in
  try {
    const account = await stripe.accounts.retrieve();
    console.log('Stripe Account Info:');
    console.log(`  Mode: ${account.charges_enabled ? 'LIVE' : 'TEST'}`);
    console.log(`  Country: ${account.country}`);
    console.log(`  Default Currency: ${account.default_currency?.toUpperCase()}`);
  } catch (error) {
    console.log('Could not retrieve account info');
  }
}

verifyPrices();