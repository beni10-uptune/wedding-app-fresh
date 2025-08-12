import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebase_admin: {
      auth_initialized: !!adminAuth,
      db_initialized: !!adminDb,
    },
    environment_variables: {
      project_id: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      client_email: !!process.env.FIREBASE_CLIENT_EMAIL,
      private_key: !!process.env.FIREBASE_PRIVATE_KEY,
      private_key_length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      stripe_secret: !!process.env.STRIPE_SECRET_KEY,
      stripe_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
      stripe_publishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    stripe_keys: {
      has_secret_key: !!process.env.STRIPE_SECRET_KEY,
      secret_key_type: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 
                       process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'invalid',
      has_publishable_key: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      publishable_key_type: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? 'test' : 
                             process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') ? 'live' : 'invalid',
    }
  };

  // Test Firebase Admin functionality if initialized
  if (adminAuth) {
    try {
      // Try to list one user to verify auth works
      const listUsersResult = await adminAuth.listUsers(1);
      status.firebase_admin.auth_working = true;
      status.firebase_admin.user_count = listUsersResult.users.length;
    } catch (error) {
      status.firebase_admin.auth_working = false;
      status.firebase_admin.auth_error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  if (adminDb) {
    try {
      // Try to read from a collection to verify Firestore works
      const testCollection = await adminDb.collection('weddings').limit(1).get();
      status.firebase_admin.db_working = true;
      status.firebase_admin.test_doc_count = testCollection.size;
    } catch (error) {
      status.firebase_admin.db_working = false;
      status.firebase_admin.db_error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // Color code the response based on status
  const isHealthy = status.firebase_admin.auth_initialized && 
                    status.firebase_admin.db_initialized &&
                    status.environment_variables.stripe_secret &&
                    status.environment_variables.stripe_publishable;

  return NextResponse.json(status, { 
    status: isHealthy ? 200 : 503,
    headers: {
      'X-Health-Status': isHealthy ? 'healthy' : 'unhealthy'
    }
  });
}