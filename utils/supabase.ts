import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.SUPABASE_URL || 'https://pfrfsfizuzgpaqrmjjor.supabase.co';
const supabaseAnonKey: string  = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmZzZml6dXpncGFxcm1qam9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MjY1MTQsImV4cCI6MjA0ODUwMjUxNH0.AeYyHcne0RE_qDnbqwive8zj4Wo4kVZl3BxGJt-wu9Y';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})