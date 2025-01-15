import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


export async function GET(request: Request, { id }: { id: string }) {
  if (!id) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('rides')
      .select('ride_id, start_location, end_location, start_latitude, start_longitude, end_latitude, end_longitude, route_name, user_id, route_id')
      .eq('user_id', id) 
      .order('created_at', { ascending: false })
      .limit(3);; 

    if (error) {
      console.error("Error fetching recent rides:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching recent rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { id }: { id: string } ) {
  const { route_id }=  await request.json();

    if (!id && !route_id) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    try {
      // Delete the specific ride from Supabase by route_id
      const { data, error } = await supabase
        .from('rides')
        .delete()
        .eq('user_id', id)
        .eq('route_id', route_id);
  
      if (error) {
        console.error("Error deleting ride:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
      }
  
    //   if (data && data.length > 0) {
    //     console.log(`Ride with route_id ${route_id} deleted.`);
    //     return Response.json({ message: `Ride with route_id ${route_id} deleted successfully.` });
    //   } else {
    //     return Response.json({ error: "Ride not found or already deleted" }, { status: 404 });
    //   }

    return Response.json({ message: "Ride deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error("Error deleting ride:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }




