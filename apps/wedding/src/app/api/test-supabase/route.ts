import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Test with service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing Supabase credentials',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test basic queries
    const tests = {
      profiles: null as any,
      weddings: null as any,
      songs: null as any,
    };
    
    // Test profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    tests.profiles = profileError ? { error: profileError.message } : { count: profiles?.length || 0 };
    
    // Test weddings table
    const { data: weddings, error: weddingError } = await supabase
      .from('wedding_weddings')
      .select('id')
      .limit(1);
    
    tests.weddings = weddingError ? { error: weddingError.message } : { count: weddings?.length || 0 };
    
    // Test songs table
    const { data: songs, error: songError } = await supabase
      .from('songs')
      .select('id')
      .limit(1);
    
    tests.songs = songError ? { error: songError.message } : { count: songs?.length || 0 };
    
    // Try to create a test user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: `test-${Date.now()}@example.com`,
      email_confirm: true,
      user_metadata: {
        name: 'Test User',
        initial_app: 'wedding'
      }
    });
    
    const authTest = authError ? { error: authError.message } : { userId: authUser?.user?.id };
    
    // Clean up test user if created
    if (authUser?.user?.id) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
    }
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      tests,
      auth: authTest
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error.message 
    }, { status: 500 });
  }
}