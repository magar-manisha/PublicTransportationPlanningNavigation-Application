import { useAuth } from "@clerk/clerk-expo";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-virtualized-view";

import RideLayout from "@/components/RideLayout";
import { icons, images } from "@/constants";
import { useLocationStore, useRouteStore } from "@/store";
import { useFetch } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { BusLocationProp, RouteData, StopCalc, StopType } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addTimes, calculateArrivalTime, calculateETA, calculateWalkingETA } from "@/lib/utils";

// const Section = ({
//   icon,
//   title,
//   content,
// }: {
//   icon: any;
//   title: string;
//   content: string;
// }) => (
//   <View className="flex-row items-center">
//     {title === "Walk to" || title === "Get off" ? (
//       <Image source={icon} className="w-7 h-7" />
//     ) : (
//       <Image source={icon} className="w-5 h-6" />
//     )}
//     <View className="flex flex-col w-full py-3 ml-2 border-b-2 border-[#A5D6A7]">
//       <Text className="text-lg font-JakartaRegular">{title}</Text>
//       <Text className="text-lg font-JakartaBold">{content}</Text>
//     </View>
//   </View>
// );

const TripDetails = () => {
  const { userAddress, destinationAddress, userLatitude,userLongitude, destinationLatitude,destinationLongitude } = useLocationStore();
  const { routes, selectedRoute } = useRouteStore();
  const { userId } = useAuth();

  const uAddress = userAddress?.split(",").slice(0, 2).join(", ");
  const dAddress = destinationAddress?.split(",").slice(0, 2).join(", ");

  const [showStop, setShowStop] = useState(false);
  // const [stopsData, setStopsData] = useState<StopType[] >([]);
  // const [busLocations, setBusLocations] = useState<BusType[] >([])

  useEffect(() => {
    if (selectedRoute) {
      AsyncStorage.setItem(
        "recent_routes",
        JSON.stringify([selectedRoute])
      ).catch((error) => console.error("Error saving route:", error));
    }
  }, [selectedRoute]);
  console.log("selectedRoute:", selectedRoute);
  if (!selectedRoute) {
    return (
      <View className="flex flex-col items-center justify-center">
        <Image
          source={images.noResult}
          className="w-40 h-40"
          alt="No recent rides found"
          resizeMode="contain"
        />
        <Text className="text-sm">No route has been selected</Text>
      </View>
    );
  }

  const {
    data: routedata,
    loading,
    error,
  } = useFetch<RouteData>(`/(api)/route/${selectedRoute.route_id}`);

  console.log("routedata:", routedata);

  if (!routedata) {
    return (
      <View className="flex flex-col items-center justify-center">
        <Image
          source={images.noResult}
          className="w-40 h-40"
          alt="No recent rides found"
          resizeMode="contain"
        />
        <Text className="text-sm">No route Data found</Text>
      </View>
    );
  }

  const stops: StopType[] = routedata?.stops || [];
  const buses: BusLocationProp[] = routedata?.buses || [];

  const stopsInfo: StopCalc[] = stops.map(info => ({
    location: {
      lat: info.stops.latitude,
      lon: info.stops.longitude,
    },
    duration: 5,
  }));
  if (stops) {
    stops.forEach((stop) => {
      console.log("stop are:", stop.stops.stop_name); // Accessing stop_name from stops object
    });
  }

  if (buses) {
    buses.forEach((bus) => {
      console.log("bus are:", bus.bus_id); // Accessing bus_number
    });
  }
  
  const firstBus= calculateETA(buses[0].latitude, buses[0].longitude,selectedRoute.start_latitude, selectedRoute.start_longitude, buses[0].speed, stopsInfo )
  const currentDate = new Date();
  const startTime = addTimes(0, firstBus.minutes,currentDate.getHours(), currentDate.getMinutes())
  const start = addTimes(startTime.totalHours, startTime.totalMinutes,0,15)
  const end = addTimes(startTime.totalHours, startTime.totalMinutes,0,55)
  return (
    <RideLayout title="Start ride" snapPoints={["20%", "50%", "90%"]}>
      <ScrollView>
        <View className=" flex-col w-full items-start justify-center mt-5 relative pl-8 sm:pl-32 py-6 group">
          {/* Start Location */}
          <View className="flex flex-col sm:flex-row items-start mb-1 relative w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.pin} className="w-5 h-6" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                  Start From
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-base">Leave At</Text>
                <Text className="px-2 text-base font-JakartaExtraBold">~{start.totalHours}: {start.totalMinutes}</Text>
                
              </View>
            </View>

            <View className="relative pl-8 sm:pl-32 group w-full">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-black w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] w-full py-3 ml-2">
                <Text className="text-lg font-JakartaBold pb-4">
                  {uAddress}
                </Text>
              </View>
            </View>
          </View>
          {/* Walk to */}
          <View className="flex flex-col sm:flex-row items-start mt-2 relative w-full">
          <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.walk} className="w-5 h-7" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                 Walk To
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="px-2 text-base font-JakartaExtraBold">~15</Text>
                <Text className="text-base">min</Text>
              </View>
            </View>
            <View className="relative pl-8 sm:pl-32 group w-full">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-[#E9C05E] w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] w-full py-3 ml-2">
                <Text className="text-lg font-JakartaBold pb-4">
                  {selectedRoute.start_location}
                </Text>
              </View>
            </View>
          </View>
          {/* Ride to */}
          <View className="flex flex-col sm:flex-row items-start mt-4 relative w-full">
          <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.bus} className="w-5 h-6" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                 Ride To
                </Text>
              </View>
              {/* <View className="flex flex-row items-center">
                <Text className="px-2 text-base font-JakartaExtraBold">8:00</Text>
                <Text className="text-base">hour</Text>
              </View> */}
            </View>
            <View className="relative pl-8 sm:pl-32 group w-full">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-[#006600] w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] py-3 ml-2">
                <View className="text-lg font-JakartaRegular rounded-xl shadow-xl shadow-[#607D8B] opacity-100 bg-white my-3 p-2 w-full">
                  <FlatList
                    data={buses}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View className="flex flex-row justify-between p-2 font-JakartaMedium items-center">
                        <Text className="text-base font-JakartaBold items-center">
                          BUS {item.bus_id}
                        </Text>

                        <View className="flex-row justify-center  py-2 rounded-lg px-2">
                          <Image source={icons.tower} className="w-6 h-6 items-center" />
                          <View className="flex flex-row">
                            <Text className="text-base font-JakartaExtraBold items-center">
                            ~{ calculateETA(item.latitude, item.longitude,selectedRoute.start_latitude, selectedRoute.start_longitude, item.speed, stopsInfo ).minutes}
                            </Text>
                            <Text className="text-base"> min</Text>
                          </View>
                        </View>
                      </View>
                    )}
                    className="bg-[#F5F5F5] m-2"
                    nestedScrollEnabled={true}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Stops */}
          <View className="flex flex-col sm:flex-row items-start mt-3 relative w-full">
          <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.busStop} className="w-5 h-6" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                Start From
                </Text>
              </View>
              {/* <View className="flex flex-row items-center">
                <Text className="px-2 text-base font-JakartaExtraBold">30</Text>
                <Text className="text-base">min</Text>
              </View> */}
            </View>
            <View className="relative pl-8 sm:pl-32 group w-full">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-gray-500 w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] w-full py-3 ml-2">
                <Text className="text-lg font-JakartaBold">
                  {stops[0].stops.stop_name}
                </Text>
                <TouchableOpacity
                  className="flex text-lg font-JakartaRegular rounded-3xl shadow-xl shadow-[#607D8B] opacity-100 bg-white my-3 px-4 py-2 w-2/3  justify-between"
                  onPress={() => setShowStop(!showStop)}
                >
                  <View>
                    <View className="flex flex-row justify-between items-center">
                      <Text className="font-JakartaRegular text-lg">Stop</Text>
                      <Image source={icons.arrowDown} className="w-6 h-7 " />
                    </View>

                    {showStop && (
                      <FlatList
                        data={stops.slice(1, -1)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <Text className="p-2 text-lg text-gray-800 font-JakartaBold">
                            {item.stops.stop_name}
                          </Text>
                        )}
                        className="bg-[#F5F5F5] mt-2"
                        nestedScrollEnabled={true}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Text className="text-lg font-JakartaBold">
                  {stops[stops.length - 1].stops.stop_name}
                </Text>
              </View>
            </View>
          </View>
          {/* Get Off */}
          <View className="flex flex-col sm:flex-row items-start mt-3 relative">
          <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.getOff} className="w-5 h-6" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                Get Off
                </Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="px-2 text-base font-JakartaExtraBold">~15</Text>
                <Text className="text-base">min</Text>
              </View>
            </View>
            <View className="relative pl-8 sm:pl-32 group">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-[#E9C05E] w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] w-full py-3 ml-2">
                <Text className="text-lg font-JakartaBold pb-4">
                  {selectedRoute.end_location}
                </Text>
              </View>
            </View>
          </View>
          {/* Arrive */}
          <View className="flex flex-col sm:flex-row items-start mt-3 relative">
          <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center">
                <Image source={icons.endFlag} className="w-5 h-6" />
                <Text className=" font-JakartaRegular font-caveat font-medium text-xl pl-5">
                Arrive At
                </Text>
              </View>
              <View className="flex flex-row items-center">
              <Text className="text-base">Arrive at</Text>
                <Text className="px-2 text-base font-JakartaExtraBold">~{end.totalHours}:{end.totalMinutes}</Text>
              </View>
            </View>
            <View className="relative pl-8 sm:pl-32 group">
              {/* Line (before) */}
              <View className="absolute left-2 sm:left-0 h-full bg-red-500 w-[7px] self-start -translate-x-1/2 translate-y-1" />
              {/* Dot (after) */}
              <View className="flex flex-col border-b-2 border-[#A5D6A7] w-full py-3 ml-2">
                <Text className="text-lg font-JakartaBold pb-4">
                  {dAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </RideLayout>
  );
};

export default TripDetails;
