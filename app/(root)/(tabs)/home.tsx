import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";

import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import { useFetch } from "@/lib/fetch";
import { Ride, Route } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Page() {

  const { user } = useUser();
  const { signOut } = useAuth();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/${user?.id}`);
  console.log("recentRides", recentRides);


  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [recentRoute, setRecentRoute] = useState<Route[]>([]);

  const deleteFromAsyncStorage = async (routeId: number) => {
    try {
      const updatedRoutes = recentRoute.filter(
        (route) => route.route_id !== routeId
      );
      setRecentRoute(updatedRoutes);
      await AsyncStorage.setItem(
        "recent_routes",
        JSON.stringify(updatedRoutes)
      );
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const deleteFromDatabase = async (route_id: number) => {
    try {
      const response = await fetch(`/(api)/${user?.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route_id: route_id
        }),
      });
      
  
      // Check if the response is successful (status 200)
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Success message
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error); // Error message
      }
    } catch (error) {
      console.error("Error:", error); // Network or other error
    }
  };

  useEffect(() => {
    const fetchRecentRoute = async () => {
      try {
        const route = await AsyncStorage.getItem("recent_routes");
        if (route) {
          setRecentRoute(JSON.parse(route));
        }
      } catch (error) {
        console.error("Error retrieving route:", error);
      }
    };
  
    fetchRecentRoute();
    console.log("recentRoutes",recentRoute);
  }, []);

  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  const handleLocationPress = () => {
    router.push("/(root)/find-start");
  };


  const handelBus = ()=>{
    router.push("/(root)/(tabs)/find-bus")
  }
  const handelPoi = ()=>{
    router.push("/(root)/(tabs)/find-poi")
  }
  const handelMap = ()=>{
    router.push("/(root)/(tabs)/find-map")
  }
  const handelNotice = ()=>{
    router.push("/(root)/(tabs)/find-issues")
  }
  return (
    <RideLayout title="home">
      <TouchableOpacity
        onPress={handleLocationPress}
        className="flex bg-white rounded-lg shadow-sm shadow-neutral-300 p-4"
      >
        <View className="flex flex-row items-center ">
          <Image source={icons.search} className="w-10 h-10" />
          <Text className="text-lg font-JakartaBold px-6" numberOfLines={1}>
            Get Me SomeWhere
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row justify-between items-center my-5 w-full ">
        <TouchableOpacity onPress={handelBus} className="flex items-center bg-[#E9C05E] rounded-xl py-2 w-[23%] mr-1">
          <Image source={icons.bus} className="w-8 h-7 " />
          <Text className="text-sm font-JakartaRegular text-center ">
            Bus
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity className="flex items-center bg-[#186118] rounded-xl py-2  w-[18%] mr-1">
          <Image source={icons.walk} className="w-8 h-8 " />
          <Text className="text-sm font-JakartaRegular text-center text-white">
            Walk
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handelPoi} className="flex items-center bg-[#E9C05E] rounded-xl py-1  w-[23%] mr-1">
          <Image source={icons.poi} className="w-8 h-9 " />
          <Text className="text-sm font-JakartaRegular text-center ">
            POI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handelMap} className="flex items-center bg-[#E9C05E] rounded-xl py-1  w-[23%] mr-1">
          <Image source={icons.frontMap} className="w-9 h-9 " />
          <Text className="text-sm font-JakartaRegular text-center ">
            Maps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handelNotice} className="flex items-center bg-[#E9C05E] rounded-xl py-2 w-[23%]">
          <Image source={icons.issues} className="w-8 h-7 " />
          <Text className="text-sm font-JakartaRegular text-center ">
            Notify
          </Text>
        </TouchableOpacity>
      </View>

      <View>

      {(recentRoute && recentRoute.length > 0 || recentRides && recentRides.length > 0) && <Text className="text-xl font-JakartaBold mt-5 mb-3 pl-2 text-white">
        All Ride
      </Text>}


      {recentRoute && recentRoute.length > 0 && (
        <FlatList
          data={recentRoute}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              title="Recent Ride"
              deleteRoute={async (route_id: number) => {
                await deleteFromAsyncStorage(route_id); // Call Async Storage deletion
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: 5,
          }}
        />
      )}

      {recentRides && recentRides.length > 0 && (
        <FlatList
          data={recentRides?.slice(0, 5)}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              title="Save Ride"
              deleteRoute={async (route_id: number) => {
                await deleteFromDatabase(route_id); 
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            // paddingTop: 5,
          }}
        />
      )}
      </View>
    </RideLayout>
  );
}
