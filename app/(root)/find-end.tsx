import { router } from "expo-router";
import { Text, View } from "react-native";


import CustomButton from "@/components/CustomButton";
import OpenStreetTextInput from "@/components/OpenStreetTextInput"; // Import the new OpenStreetTextInput component
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore, useStopStore } from "@/store";
import { useEffect, useState } from "react";
import { useFetch } from "@/lib/fetch";
import { Stop } from "@/types/type";
import { getDistanceFromLatLonInKm } from "@/lib/utils";


const FindStart = () => {
  const {
    destinationAddress,
    destinationLatitude,
    destinationLongitude,
    setDestinationLocation,
  } = useLocationStore();


  const {
    endStops,
    setEndStops,
  } = useStopStore();

  const { data: stops, loading } = useFetch<Stop[]>("/(api)/route/stop");


  const fetchEndStops = async () => {
    if (!stops || !destinationLatitude || !destinationLongitude) return;


    const stopsWithDistance = stops.map(stop => ({
      ...stop,
      distance: getDistanceFromLatLonInKm(
          destinationLatitude,
          destinationLongitude,
          stop.latitude,
          stop.longitude
      )
  })) .filter(stop => stop.distance <= 3);;

  
  stopsWithDistance.sort((a, b) => a.distance - b.distance);
  console.log("End Stop are", stopsWithDistance.slice(0, 3))
  setEndStops( stopsWithDistance.slice(0, 3));
  };

  useEffect(() => {
    if (destinationLatitude && destinationLongitude && stops) {
      fetchEndStops();
  }
  }, [destinationLatitude, destinationLongitude, stops]);
  


  const handleDestinationPress = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
     setDestinationLocation(location);
  };

  return (
    <RideLayout title="Ride" snapPoints={["20%", "80%"]}>
      <View className="my-3">
        <Text className="text-lg font-JakartaBold mb-3 text-white">To</Text>

        <OpenStreetTextInput
          icon={icons.map} // Use your icon for the text input
          initialLocation={destinationAddress || undefined} // Initial location text
          containerStyle="bg-neutral-100" // Style for the container
          textInputBackgroundColor="#f5f5f5" // Background color for the text input
          handlePress={handleDestinationPress} // Function to handle when a location is selected
          title = "To"
        />
        
      </View>

      {/* <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/route-suggestion`)} // Navigation action on button press
        className="mt-5"
      /> */}
    </RideLayout>
  );
};

export default FindStart;
