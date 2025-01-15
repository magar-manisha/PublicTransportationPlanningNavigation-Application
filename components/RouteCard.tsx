import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { BusRouteProps } from "@/types/type";
import { router } from "expo-router";

const RouteCard = ({ item, selected, setSelected }: BusRouteProps) => {

  const startLocation = item.start_location?.split(',').slice(0, 2).join(', ');

  const handelPress = () => {
    setSelected();
    router.push(`/(root)/trip-details`);
  }

  return (
    <TouchableOpacity
      onPress={handelPress}
      className={`bg-white flex flex-row items-center justify-between py-5 px-3 rounded-xl my-2`}
    >
      <View className="flex-1 flex flex-col items-start justify-center mx-1">
        <View className="flex flex-row items-center mb-1 justify-between  w-full">
  
          <View className="flex flex-row items-center space-x-1">
          <Image source={icons.bus} className="w-5 h-5" />
          <Text className="text-base font-JakartaBold pl-1">{item.route_name}</Text>
          </View>


          <View className="flex flex-row items-center mb-1">
          <View className="flex flex-row items-center pr-2">
            <Image source={icons.rupees} className="w-5 h-5" />
            <Text className="text-lg font-JakartaBold">
               {item.fare_amount }
            </Text>
          </View>


          <Text className="text-lg font-JakartaBold pl-2">
            {/* {formatTime(item.estimatedTime!)} */}
            {item.estimated_time} min
          </Text>
          </View>

        </View>

        <View className="flex flex-row items-center justify-start">

          <Text className="text-base font-JakartaRegular text-general-200 pr-2">
          in {item.frequency} min
          </Text>

          <Text className="text-base font-JakartaRegular text-general-200">
          from {startLocation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteCard;