import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      start_location,
      end_location,
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
      route_name,
      route_id,
      user_id
    } = body;

    // Validate required fields
    if (
      ! start_location||
      !end_location ||
      !start_latitude ||
      !start_longitude ||
      !end_latitude ||
      !end_longitude ||
      !route_name ||
      !route_id ||
      !user_id
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }


    const { data: existingRoute, error: fetchError } = await supabase
      .from("rides")
      .select("ride_id")
      .eq("route_id", route_id);

    if (fetchError) {
      console.error("Error fetching ride:", fetchError);
      return new Response(
        JSON.stringify({ error: "Error checking existing ride" }),
        { status: 500 }
      );
    }

    if (existingRoute && existingRoute.length > 0) {
      return new Response(
        JSON.stringify({ error: "Ride with this route_id already exists" }),
        { status: 409 }
      );
    }

    const { data, error } = await supabase
    .from("rides")
    .insert([
      {
        start_location,
        end_location,
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        route_name,
        route_id,
        user_id,
      },
    ]).select("*"); 

    if (error) {
      console.error("Error inserting ride:", error);
      return new Response(
        JSON.stringify({ error: "Error inserting ride" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ data: data[0] }), { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
