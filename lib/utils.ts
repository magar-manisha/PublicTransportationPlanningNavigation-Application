import { Ride } from "@/types/type";

// export const sortRides = (rides: Ride[]): Ride[] => {
//   const result = rides.sort((a, b) => {
//     const dateA = new Date(`${a.created_at}T${a.ride_time}`);
//     const dateB = new Date(`${b.created_at}T${b.ride_time}`);
//     return dateB.getTime() - dateA.getTime();
//   });

//   return result.reverse();
// };

export function formatTime(minutes: number): string {
  const formattedMinutes = +minutes?.toFixed(0) || 0;

  if (formattedMinutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}


export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}


export function calculateArrivalTime(currentLat: number, currentLon: number, destinationLat: number, destinationLon: number, averageSpeed: number): String {
  const distance = getDistanceFromLatLonInKm(currentLat, currentLon, destinationLat, destinationLon);

  const travelTimeInHours = distance / averageSpeed;

  const travelTimeInMilliseconds = travelTimeInHours * 60 * 60 * 1000; // Convert hours to milliseconds
  const currentTime = new Date();
  const arrivalTime = new Date(currentTime.getTime() + travelTimeInMilliseconds);

  const hours = arrivalTime.getHours();
  const minutes = arrivalTime.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return formattedTime;
}


export const subtractTime= (hoursToSubtract: number, minutesToSubtract: number) => {
  const now = new Date(); // Get current date and time

  // Subtract hours and minutes
  now.setHours(now.getHours() - hoursToSubtract); // Subtract hours
  now.setMinutes(now.getMinutes() - minutesToSubtract); // Subtract minutes

  const updatedHours = now.getHours(); // Get updated hours
  const updatedMinutes = now.getMinutes(); // Get updated minutes

  return { updatedHours, updatedMinutes };
};

export const addTimes = (hours1: number, minutes1: number, hours2: number, minutes2: number) => {
  // Add hours and minutes separately
  let totalHours = hours1 + hours2;
  let totalMinutes = minutes1 + minutes2;

  // If the total minutes exceed 60, convert to hours
  if (totalMinutes >= 60) {
    totalHours += Math.floor(totalMinutes / 60); // Add the extra hours
    totalMinutes = totalMinutes % 60;  // Keep the remaining minutes
  }

  // Adjust the hours to fit within 12-hour format
  totalHours = totalHours % 12; 

  // If totalHours becomes 0, set it to 12 (as 12-hour clocks do not show 0)
  if (totalHours === 0) {
    totalHours = 12;
  }

  return { totalHours, totalMinutes };
};



export function calculateETA(
  currentLat: number,
  currentLon: number,
  destinationLat: number,
  destinationLon: number,
  busSpeed: number, // Real-time bus speed in km/h
  stops: Array<{ location: { lat: number; lon: number }; duration: number }>, // Array of stop locations and durations in minutes
){
  // Step 1: Calculate remaining distance
  const distance = getDistanceFromLatLonInKm(currentLat, currentLon, destinationLat, destinationLon);

  // Step 2: Fetch traffic-adjusted speed
  const  adjustedSpeed  = 0

  // Step 3: Calculate effective speed
  const effectiveSpeed = (busSpeed + adjustedSpeed) / 2; // Weighted speed

  // Step 4: Calculate travel time (hours)
  const travelTimeInHours = distance / effectiveSpeed;

  // Step 5: Calculate total stop time
  const totalStopTimeInMinutes = stops.reduce((total, stop) => total + stop.duration, 0);
  const totalStopTimeInHours = totalStopTimeInMinutes / 60;

  // Step 6: Add travel time and stop time
  const totalTravelTimeInHours = travelTimeInHours + totalStopTimeInHours;

  // Step 7: Calculate ETA
  const etaTime = new Date( totalTravelTimeInHours * 60 * 60 * 1000);

  return {
    hours: etaTime.getHours(),
    minutes: etaTime.getMinutes(),
  };
}


export const calculateWalkingETA = async (userLat: number, userLon: number, stopLat: number, stopLon:number) => {
  const url = `http://router.project-osrm.org/route/v1/foot/${userLon},${userLat};${stopLon},${stopLat}?overview=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok") {
      const durationInSeconds = data.routes[0].duration; // Duration in seconds
      const etaTime = new Date(new Date().getTime() + durationInSeconds * 1000);

      return { hours: etaTime.getHours(), minutes: etaTime.getMinutes() };
    } else {
      throw new Error("Unable to calculate walking ETA");
    }
  } catch (error) {
    console.error("Error fetching walking ETA:", error);
    return null;
  }
};


