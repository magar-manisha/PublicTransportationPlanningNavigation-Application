import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { icons } from "@/constants";
import { router } from "expo-router";

interface Bus {
  bus_id: string;
  bus_number: string;
}

const FindBus = () => {
  const [busNumber, setBusNumber] = useState<string>(""); // User input
  const [busList, setBusList] = useState<Bus[]>([]); // Fetched bus list
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const searchBuses = async (query: string) => {
    if (query.trim() === "") {
      setBusList([]); // Clear the list if the query is empty
      return;
    }

    setIsLoading(true); // Start loading indicator
    try {
      const response = await fetch(`/(api)/bus/${query}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        setBusList([]); // Clear the list on error
        return;
      }

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setBusList(result.data);
      } else {
        setBusList([]); // Clear list if no data
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBusList([]); // Clear the list on error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchBuses(busNumber); // Fetch buses after a delay
    }, 500); // Delay API calls (500ms)

    return () => clearTimeout(debounceTimeout); // Cleanup timeout on input change
  }, [busNumber]); // Dependency array ensures re-fetch on busNumber change

  return (
    <View className="bg-[#F5F5F5] flex-1">
      <View className="pt-5 bg-[#006600] h-48 px-5">
        <View className="flex flex-row absolute z-10 top-12 items-center justify-start px-5">
          <TouchableOpacity onPress={() => router.push("/home")}>
            <View className="w-7 h-7 bg-white rounded-full items-center justify-center">
              <Image
                source={icons.backArrow}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-JakartaSemiBold ml-5 text-white">
            Find Bus
          </Text>
        </View>

        <TextInput
          style={{ width: "100%" }}
          className="h-16 rounded-md px-2 text-l bg-white text-black top-20 mr-3 w-full"
          placeholder="Enter Bus Number"
          value={busNumber}
          onChangeText={(text) => setBusNumber(text)}
        />
      </View>

      <View className="bg-[#F5F5F5] flex-1 px-4 ">
        {isLoading ? (
          <Text className="text-center mt-5 text-gray-500">Loading...</Text>
        ) : busList.length > 0 ? (
          <FlatList
            data={busList}
            keyExtractor={(item) => item.bus_id}
            renderItem={({ item }) => (
              <View className="flex flex-col border-b-2 border-[#A5D6A7] py-3 h-16 ">
                <View className="flex-row items-center">
                  <Image source={icons.bus} className="w-5 h-6" />
                  <Text className="text-lg font-bold pl-4">
                    {item.bus_number}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          busNumber.trim() && (
            <Text className="text-center mt-5 text-gray-500">
              No buses found
            </Text>
          )
        )}
      </View>
    </View>
  );
};

export default FindBus;
