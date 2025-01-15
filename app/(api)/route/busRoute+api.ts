import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const { start_lat, start_lon, destination_lat, destination_lon } =
      await request.json();

    console.log("Received start location:", start_lat, start_lon);
    console.log(
      "Received destination location:",
      destination_lat,
      destination_lon
    );

    // Check if any of the coordinates are missing
    if (
      start_lat === undefined ||
      start_lon === undefined ||
      destination_lat === undefined ||
      destination_lon === undefined
    ) {
      return Response.json(
        { error: "Missing coordinates in request body" },
        { status: 400 }
      );
    }

    const tolerance = 0.0001;

    // Fetch routes based on the given coordinates
    const { data: routes, error: routeError } = await supabase
      .from("routes")
      .select(
        `
        route_id,
        route_name,
        start_location,
        start_latitude,
        start_longitude,
        end_location,
        end_latitude,
        end_longitude,
        estimated_time,
        frequency
      `
      )
      .eq('start_latitude', start_lat)
      .eq('start_longitude', start_lon)
      .eq('end_latitude', destination_lat)
      .eq('end_longitude', destination_lon); 

    if (routeError) {
      console.error("Error fetching routes:", routeError);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

    if (routes.length === 0) {
      return Response.json({ error: "No routes found" }, { status: 404 });
    }

    // Now fetch fares based on route_ids (assuming 'fares' table has 'route_id' column)
    const routeIds = routes.map((route) => route.route_id);
    const { data: fares, error: fareError } = await supabase
      .from("fares")
      .select("fare_amount, route_id")
      .in("route_id", routeIds); // Fetch fares for all selected routes

    if (fareError) {
      console.error("Error fetching fares:", fareError);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // Map fares to routes
    const routesWithFares = routes.map((route) => ({
      ...route,
      fare_amount:
        fares.find((fare) => fare.route_id === route.route_id)?.fare_amount ||
        null,
    }));

    // Return the response with data
    return new Response(JSON.stringify({ data: routesWithFares }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
