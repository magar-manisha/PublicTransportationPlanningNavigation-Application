import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your credentials
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // Query the 'drivers' table using Supabase
    const { data, error } = await supabase
      .from('drivers')
      .select('*');

    // Handle potential errors from the query
    if (error) {
      console.error("Error fetching drivers:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Return the result if there is no error
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
