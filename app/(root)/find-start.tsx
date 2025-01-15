import { router } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useFetch } from "@/lib/fetch";


import CustomButton from "@/components/CustomButton";
import OpenStreetTextInput from "@/components/OpenStreetTextInput"; // Import the new OpenStreetTextInput component
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore, useStopStore } from "@/store";
import { Stop } from "@/types/type";
import { getDistanceFromLatLonInKm } from "@/lib/utils";

const FindStart = () => {
  const {
    userAddress,
    userLatitude,
    userLongitude,
    setUserLocation,
  } = useLocationStore();

  const {
    startStops,
    setStartStops,
  } = useStopStore();

  const { data: stops, loading } = useFetch<Stop[]>("/(api)/route/stop");


  const fetchStartStops = () => {

    if (!stops || userLatitude == null || userLongitude == null) {
      return; 
    }

    const stopsWithDistance = stops.map(stop => ({
      ...stop,
      distance: getDistanceFromLatLonInKm(
          userLatitude,
          userLongitude,
          stop.latitude,
          stop.longitude
      )
  })) .filter(stop => stop.distance <= 3);;

  
  stopsWithDistance.sort((a, b) => a.distance - b.distance);
  console.log("Start Stop are", stopsWithDistance.slice(0, 3))
  setStartStops( stopsWithDistance.slice(0, 3));
  }

  useEffect(() => {
    if(userLatitude && userLongitude && stops){
    fetchStartStops();
    }
  }, [userLatitude, userLongitude, stops]);
  



  const handleLocationSelect = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
     setUserLocation(location);
  };

  return (
    <RideLayout title="Ride" snapPoints={["20%", "80%"]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaBold mb-3 text-white">From</Text>

        <OpenStreetTextInput
                icon={icons.target}
                initialLocation={userAddress || undefined} // Ensure it doesn't pass null
                containerStyle="bg-neutral-100"
                textInputBackgroundColor="#f5f5f5"
                handlePress={handleLocationSelect}
                title = "From"
            />
      </View>
{/* 
      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/find-end`)} // Navigation action on button press
        className="mt-5"
      /> */}

    </RideLayout>
  );
};

export default FindStart;
