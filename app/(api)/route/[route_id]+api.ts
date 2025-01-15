import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request, {route_id}: {route_id:string}) {  
  try {

    if (!route_id) {
      return Response.json({ error: "route_id is required" }, { status: 400 });
    }
    console.log(route_id)
    
    const { data: stopsData, error: stopsError } = await supabase
      .from('route_stops')
      .select(`
        stop_id,
        stops (stop_name, latitude, longitude), 
        stop_order
      `)
      .eq('route_id', route_id)
      .order('stop_order', { ascending: true });

    if (stopsError) {
      return Response.json({ error: "No routes found" }, { status: 404 });
    }

    const { data: busesData, error: busesError } = await supabase
      .from("bus_locations")
      .select("*")
      .eq("route_id", route_id);

    if (busesError) {
      return Response.json({ error: "Error fetching bus locations" }, { status: 404 });
    }

    const combine = {
      stops:stopsData, 
      buses:busesData
    };

    return new Response(
      JSON.stringify({
        data:combine
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stops:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
