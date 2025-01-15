import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons, images } from "@/constants";
import { router } from "expo-router";

const findIssues = () => {
  const gohome = async () => {
    router.push("/(root)/(tabs)/home");
  };
  return (
    <View>
      <View className="bg-[#E9C05E] h-32">
        <View className="flex flex-row absolute z-10 top-12 items-center justify-start px-5">
          <TouchableOpacity onPress={gohome}>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
              <Image
                source={icons.backArrow}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-JakartaSemiBold ml-5">Notification</Text>
        </View>
      </View>
      <View>
         <View className="flex flex-col items-center justify-center">
                <Image
                  source={images.message}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-lg font-JakartaExtraBold">No Any Notification</Text>
              </View>
        
      </View>
    </View>
  );
};

export default findIssues;
