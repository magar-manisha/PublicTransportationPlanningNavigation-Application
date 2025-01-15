import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request, { bus_id }: { bus_id: string }) {
  try {
    // Validate input
    if (!bus_id) {
      return new Response(JSON.stringify({ error: "bus_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Searching for bus with ID:", bus_id);

    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("buses")
      .select("bus_id, bus_number")
      .ilike("bus_number", `%${bus_id}%`); // Case-insensitive search

    if (error || !data.length) {
      return new Response(
        JSON.stringify({ error: "No bus found matching the criteria" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return successful response
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching bus:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
