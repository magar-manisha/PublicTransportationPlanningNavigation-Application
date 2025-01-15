import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useBusLocationStore } from '@/store';
import { BusLocationProp } from '@/types/type';

// export const useFetchBusData = (route_id: number) => {
//   const {updateBusLocation } = useBusLocationStore();

//   useEffect(() => {
//     if (!route_id) {
//       console.log("No route data")
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const { data: busData, error: busError } = await supabase.from('buses').select('*').eq('route_id', route_id);

//         if (busError) {
//           console.error('Error fetching buses:', busError);
//           return;
//         }
        
//         // const { data: locationData, error: locationError } = await supabase.from('bus_locations').select('*').in('bus_id', busData.map((bus) => bus.id)); 

//         // if (locationError) {
//         //   console.error('Error fetching location data:',locationError);
//         //   return;
//         // }

//         // const combinedData = busData.map((bus) => ({
//         //   ...bus,
//         //   location: locationData.find((loc) => loc.bus_id === bus.id),
//         // }));

//         setBuses(busData); // Update Zustand store with combined data
//       } catch (error) {
//         console.error('Unexpected error during data fetch:', error);
//       }
//     };

//     fetchData();
//   }, [route_id, setBuses]);
// };


export const useBusLocationSubscription = () => {
    const { updateBusLocation } = useBusLocationStore();
  
    useEffect(() => {
      const subscription = supabase
        .channel('bus_updates') // The name of the channel
        .on('postgres_changes', {
          event: 'UPDATE',       // Listening for updates to bus locations
          schema: 'public',      // Schema name
          table: 'bus_locations', // Table name
        }, (payload) => {
          console.log('Bus location updated:', payload);
          const updatedBusData = payload.new as BusLocationProp;
          updateBusLocation(updatedBusData); // Update Zustand store
        })
        .subscribe();
  
      return () => {
        subscription.unsubscribe();
      };
    }, [updateBusLocation]);
  };