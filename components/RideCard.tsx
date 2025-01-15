import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ride, Route } from "@/types/type";
import { icons } from "@/constants";

const RideCard = ({ ride, title, deleteRoute }: { ride: Ride; title: string; deleteRoute: (route_id: number) => void }) => {
  const endLocation = ride.end_location.split(",").slice(0, 2);
  return (
    <View className="flex flex-col items-start justify-center bg-white rounded-lg mb-3">
      <View className="flex-row justify-between w-full bg-[#E9C05E] rounded-lg px-2 py-3">
        <View className="flex-row space-x-3 items-center">
          {title === "Save Ride" ? (
            <Image source={icons.saveStars} className="w-5 h-5 " />
          ) : (
            <Image source={icons.recent} className="w-5 h-5 " />
          )}
          <Text className="text-xl font-JakartaBold">{title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => deleteRoute(ride.route_id)}
          className="flex justify-end items-center">
          <Image source={icons.bin} className="w-7 h-7" />
        </TouchableOpacity>
        
      </View>
      <View className="flex flex-col mx-5 gap-y-5 flex-1 border-b-2 border-[#A5D6A7] w-full">
        <View className="flex flex-row items-center pt-2">
          <Image source={icons.to} className="w-5 h-5" />
          <Text className="text-md font-JakartaMedium px-3" numberOfLines={1}>
            {ride.route_name}
          </Text>
        </View>

        <View className="flex flex-row items-center pb-2">
          <Image source={icons.point} className="w-5 h-5" />
          <Text className="text-md font-JakartaMedium px-3" numberOfLines={1}>
            To {endLocation}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
