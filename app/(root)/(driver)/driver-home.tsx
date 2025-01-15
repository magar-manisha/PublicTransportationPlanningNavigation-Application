import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from "expo-location";
import { BusLocationProp } from '@/types/type';
import Map from '@/components/Map';
import { useBusLocationSubscription } from '@/lib/bus';
import { useBusLocationStore } from '@/store';
import { calculateBusMarkers } from '@/lib/map';


const driverHome = () => {
  const [location, setLocation] = useState<{latitude:number; longitude:number; address: string; speed: number; } | null>(null);  
  const [hasPermission, setHasPermission] = useState<boolean>(false);  
  const estimatedArrival = new Date(Date.now() + 60 * 60 * 1000); // Placeholder estimated arrival time (1 hour from now)
  const { buseslocation } = useBusLocationStore();
  
  const getBusStatus = (speed: number) => {
    const currentTime = new Date();
  
    // Check if bus has arrived (this is just a simple check, you might need more complex logic)
    if (speed === 0) {
      return 'not-operating';  // If the bus isn't moving, it's not operating
    }
  
    // Check if bus has arrived based on time or location (this logic should be updated to include arrival conditions)
    if (currentTime >= estimatedArrival) {
      return 'arrived';  // If it's past the estimated arrival time, assume bus has arrived
    }
  
    // Determine if the bus is delayed
    if (currentTime > estimatedArrival) {
      return 'delayed';  // If the bus is late, set it to delayed
    }
  
    // If the bus is moving and on time
    return 'on-time';
  };

  const updateCurrLocation = async (busData:BusLocationProp) => {
      try {
        const response = await fetch('/(api)/busLocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(busData),
        });
    
        const data = await response.json();
        console.log('Location update response:', data);
      } catch (error) {
        console.error('Error updating bus location:', error);
      }

  };


 useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermission(false);
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }else{
        Alert.alert('Permission Granted', 'Permission to access location is granted');
      }
      setHasPermission(true);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, 
          timeInterval: 5000, 
          distanceInterval: 1, 
        },
        (location) => {
          const speed = location.coords.speed || 0; 

          Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }).then((address) => {
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address: `${address[0].name}, ${address[0].region}`,
              speed: speed,
            });

            const busData: BusLocationProp = {
              bus_id: 2, // Dynamically assign based on actual bus info
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              speed: parseFloat(speed.toFixed(3)),
              status: getBusStatus(speed),
              estimated_arrival_time: '2024-12-01T12:00:00Z', 
              driver_id: 2, // Dynamically assign based on actual driver info
              route_id:2,
            };
            updateCurrLocation(busData);
          });
        }
      );
    
    };

    getLocation();
  }, []);

  useBusLocationSubscription();
  console.log("This is buslocation from zustan",buseslocation);

  return (
    <View>
      <Map  />
    </View>
  )
}

export default driverHome;