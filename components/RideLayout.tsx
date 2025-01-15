import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync(); 


import Map from "@/components/Map";
import { icons } from "@/constants";
import { useAuth } from "@clerk/clerk-expo";
import { useBusLocationStore, useLocationStore, useRouteStore, useStopStore } from "@/store";
import { Route } from "@/types/type";
import { useStore } from "zustand";

const RideLayout = ({
  title,
  snapPoints,
  children,
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}) => {
  const {selectedRoute, clearSelectedRoute} = useRouteStore();
  const {clearSelectedBus} = useBusLocationStore();
  const {clearStops} = useStopStore();
  
  const { userId } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isSignedIn } = useAuth()


  // let background_color = "#228B22";
  // let background_color = "#156C45";
  let background_color = "#006600";


  if (title === "Ride" || title === "Choose a ride") {
    background_color = "#708090";
  } else if (title === "Start ride" || title === 'Find bus') {
    background_color = "#F5F5F5";
  }

  const goToSett = () =>{
    router.push("/(root)/app-setting");
  }

  const gohome = async() =>{
    try {
      await Updates.reloadAsync(); 
      SplashScreen.hideAsync(); 
    } catch (e) {
      console.error('Error reloading app', e);
    }
  }

  


  const saveRide =async() =>{
    if(isSignedIn){

      try {
        const response = await fetch("/(api)/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_location: selectedRoute?.start_location,
            end_location: selectedRoute?.end_location,
            start_latitude: selectedRoute?.start_latitude,
            start_longitude: selectedRoute?.start_longitude,
            end_latitude: selectedRoute?.end_latitude,
            end_longitude: selectedRoute?.end_longitude,
            route_name: selectedRoute?.route_name,
            route_id:selectedRoute?.route_id,
            user_id: userId,
          }),
        });

        if (response.status === 409) {
          const { error } = await response.json();
          alert(error); 
          return;
        }
  
        if (response.ok) {
          const data = await response.json();
          alert("Ride saved successfully!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error saving ride:", error);
        alert("Error saving ride. Please try again.");
      }
    }else{
      Alert.alert("User not signed in. Cannot save ride.");
    }

  };


  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        <View className="flex flex-col h-screen bg-blue-500">
          {title === "home" ?(
                        <View className="flex flex-row absolute z-10 top-12 items-center justify-start px-5">
            <TouchableOpacity onPress={goToSett}>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.setting}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>
              </View>
              ): (
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
              <Text className="text-xl font-JakartaSemiBold ml-5">
                {title || "Go Back"}
              </Text>
            </View>
          )}

          {title === "Start ride" && (
            <View className="flex flex-row space-x-4 absolute z-10 top-12 right-1 items-center justify-end px-5">
              <TouchableOpacity onPress={saveRide}>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.save}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.share}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                  <Image
                    source={icons.compass}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          <Map />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["20%", "55%", "85%"]}
          index={1}
          enableHandlePanningGesture={title === "Start trip"}
          handleStyle={{ display: "none" }}
          backgroundStyle={{ backgroundColor: background_color }}
        >
          {title === "Start ride" ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
              }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetView
              style={{
                flex: 1,
                paddingHorizontal: 15,
                paddingVertical: 20,
              }}
            >
              {children}
            </BottomSheetView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
