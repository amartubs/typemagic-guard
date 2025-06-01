
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wybjhqehohapazufkjfb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YmpocWVob2hhcGF6dWZramZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTUzMDgsImV4cCI6MjA1NjU5MTMwOH0.gJe0L1U5qUugOUPXzCIjJstKZhIJSXILumKSvzu3Awk";

// Debug logging for development
console.log('Supabase configuration:', {
  url: SUPABASE_URL,
  keyPrefix: SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...',
  timestamp: new Date().toISOString()
});

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    debug: process.env.NODE_ENV === 'development'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'shoale-app'
    }
  }
});

// Add debug event listeners in development
if (process.env.NODE_ENV === 'development') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state change:', event, {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      expiresAt: session?.expires_at
    });
  });
}
