import { Bus, BusLocationProp, BusLocationStore } from "@/types/type";

// export const generateMarkersFromData = ({
//   data,
//   userLatitude,
//   userLongitude,
// }: {
//   data: Driver[];
//   userLatitude: number;
//   userLongitude: number;
// }): MarkerData[] => {
//   return data.map((driver) => {
//     const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
//     const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

//     return {
//       latitude: userLatitude + latOffset,
//       longitude: userLongitude + lngOffset,
//       title: `${driver.first_name} ${driver.last_name}`,
//       ...driver,
//     };
//   });
// };
export const calculateBusMarkers = (busLocations: BusLocationProp[]) => {
  return busLocations.map((bus) => ({
    key: bus.bus_id,
    coordinate: {
      latitude: bus.latitude,
      longitude: bus.longitude,
    },
    title: `Bus ${bus.bus_id}`,
    description: `Status: ${bus.status}`,
  }));
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 27.7172,
      longitude: 85.324,  
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.0922,
      longitudeDelta:0.0922,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// export const calculateDriverTimes = async ({
//   markers,
//   userLatitude,
//   userLongitude,
//   destinationLatitude,
//   destinationLongitude,
// }: {
//   markers: MarkerData[];
//   userLatitude: number | null;
//   userLongitude: number | null;
//   destinationLatitude: number | null;
//   destinationLongitude: number | null;
// }) => {
//   if (
//     !userLatitude ||
//     !userLongitude ||
//     !destinationLatitude ||
//     !destinationLongitude
//   )
//     return;

//   try {
//     const timesPromises = markers.map(async (marker) => {
//       // OSRM request for the route from marker to user's location
//       const responseToUser = await fetch(
//         `${process.env.EXPO_PUBLIC_OSRM_API_BASE_URL}/driving/${marker.longitude},${marker.latitude};${userLongitude},${userLatitude}?overview=false`
//       );
      
//       const dataToUser = await responseToUser.json();
//       const timeToUser = dataToUser.routes[0].duration; // Time in seconds from marker to user

//       // OSRM request for the route from user's location to the destination
//       const responseToDestination = await fetch(
//         `${process.env.EXPO_PUBLIC_OSRM_API_BASE_URL}/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=false`
//       );
      
//       const dataToDestination = await responseToDestination.json();
//       const timeToDestination = dataToDestination.routes[0].duration; // Time in seconds from user to destination

//       // Calculate total time in minutes
//       const totalTime = (timeToUser + timeToDestination) / 60; // Convert seconds to minutes

//       // Calculate price (arbitrary formula)
//       const price = (totalTime * 0.5).toFixed(2);

//       return { ...marker, time: totalTime, price };
//     });

//     return await Promise.all(timesPromises);
//   } catch (error) {
//     console.error("Error calculating driver times:", error);
//   }
// };


export const getRouteFromOSRM = async (
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
) => {
  const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes.length > 0) {
      const coordinates = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
      );
      return coordinates;
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    return [];
  }
};
