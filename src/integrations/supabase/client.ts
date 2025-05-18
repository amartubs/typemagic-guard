
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wybjhqehohapazufkjfb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YmpocWVob2hhcGF6dWZramZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTUzMDgsImV4cCI6MjA1NjU5MTMwOH0.gJe0L1U5qUugOUPXzCIjJstKZhIJSXILumKSvzu3Awk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
