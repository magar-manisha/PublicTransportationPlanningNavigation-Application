import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://pfrfsfizuzgpaqrmjjor.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmZzZml6dXpncGFxcm1qam9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MjY1MTQsImV4cCI6MjA0ODUwMjUxNH0.AeYyHcne0RE_qDnbqwive8zj4Wo4kVZl3BxGJt-wu9Y'
);
