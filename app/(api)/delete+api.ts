// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);


// export async function DELETE(request: Request, { route_id, id }: { route_id: string, id: string }) {
//     if (!id || !route_id) {
//       return Response.json({ error: "Missing required fields" }, { status: 400 });
//     }
  
//     try {
//       // Delete the specific ride from Supabase by route_id
//       const { data, error } = await supabase
//         .from('rides')
//         .delete()
//         .eq('user_id', id)
//         .eq('route_id', route_id);
  
//       if (error) {
//         console.error("Error deleting ride:", error);
//         return Response.json({ error: "Internal Server Error" }, { status: 500 });
//       }
  
//     //   if (data && data.length > 0) {
//     //     console.log(`Ride with route_id ${route_id} deleted.`);
//     //     return Response.json({ message: `Ride with route_id ${route_id} deleted successfully.` });
//     //   } else {
//     //     return Response.json({ error: "Ride not found or already deleted" }, { status: 404 });
//     //   }
//     } catch (error) {
//       console.error("Error deleting ride:", error);
//       return Response.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }
  