import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    const { bus_id, latitude, longitude, speed, status, estimated_arrival_time, driver_id } = await request.json();
      try{
    const { data, error } = await supabase
      .from('bus_locations')
      .upsert([
        {
          bus_id: bus_id,
          latitude: latitude,
          longitude: longitude,
          speed: speed,
          timestamp: new Date(),
          status: status,
          estimated_arrival_time: estimated_arrival_time,
          driver_id: driver_id
        }
      ], { onConflict: 'bus_id' }); // 'bus_id' is the unique identifier
  
    if (error) {
      return new Response(JSON.stringify({ success: false, error }), {
        headers: { "Content-Type": "application/json" },
      });
    }

  // Respond with success
  return new Response(JSON.stringify({ success: true, data }), { status: 200 });

}catch (error) {
  console.error("Error fetching drivers:", error);
  return Response.json({ error: "Internal Server Error" }, { status: 500 });
}
}