import React, { useEffect, useState } from "react";
import { View, Image, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";


import { icons } from "@/constants";
import { GoogleInputProps, OpenStreetPlace, Ride } from "@/types/type"; // Import your types here


const RECENT_RIDES_KEY = 'recent_rides';

const OpenStreetTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  title,
}: GoogleInputProps) => {
  const { user } = useUser();
  const [query, setQuery] = useState<string>(''); // Query for the search input
  const [searchResults, setSearchResults] = useState<OpenStreetPlace[]>([]); // Search results
  const [address, setAddress] = useState<string>(''); // Fetched address
  const [recentRides, setRecentRides] = useState<OpenStreetPlace[]>([]);
  const viewBox = '87.08,27.8,88.22,26.36'; 


  useEffect(() => {
    loadRecentRides(); // Load recent rides on component mount
  }, []);

  const loadRecentRides = async () => {
    try {
      const savedRides = await AsyncStorage.getItem(RECENT_RIDES_KEY);
      if (savedRides) {
        setRecentRides(JSON.parse(savedRides));
      }
    } catch (error) {
      console.error('Failed to load recent rides:', error);
    }
  };

  const saveRecentRide = async (ride: OpenStreetPlace) => {
    try {
      // Remove any existing instance of the selected ride
      const updatedRides = recentRides.filter((item) => item.place_id !== ride.place_id);
  
      // Add the new ride to the top of the list
      updatedRides.unshift(ride);
  
      // Limit the number of recent rides to 5
      const limitedRides = updatedRides.slice(0, 5);
  
      // Update the state and save to AsyncStorage
      if (JSON.stringify(limitedRides) !== JSON.stringify(recentRides)) {
        // Update the state and save to AsyncStorage only if there was a change
        setRecentRides(limitedRides);
        await AsyncStorage.setItem(RECENT_RIDES_KEY, JSON.stringify(limitedRides));
      }
    } catch (error) {
      console.error('Failed to save recent ride:', error);
    }
  };
 // Remove the item from AsyncStorage by the given key
  const deleteData = async (ride: OpenStreetPlace) => {
    try {
      const updatedRides = recentRides.filter((item) => item.place_id !== ride.place_id);
      setRecentRides(updatedRides);
      await AsyncStorage.setItem(RECENT_RIDES_KEY, JSON.stringify(updatedRides));
    } catch (error) {
      console.error('Error deleting data from AsyncStorage:', error);
    }
  };

  // Function to handle location search using OpenStreetMap's Nominatim API
  const searchLocations = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(
       `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&viewbox=${viewBox}&bounded=1`,
        {
          headers: {
            'User-Agent': 'YourApp/1.0 (your-email@example.com)',
            'accept-language': 'en',
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data: OpenStreetPlace[] = await response.json();
      setSearchResults(data); // Update search results
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  // Function to handle reverse geocoding with OpenStreetMap's Nominatim API
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&viewbox=${viewBox}&bounded=1`,
        {
          headers: {
            'User-Agent': 'YourApp/1.0 (your-email@example.com)',
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        setAddress('Error fetching address');
        return;
      }

      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name); // Update the address state
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    }
  };

  const handleLocationSelect = (item: OpenStreetPlace) => {
    
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);

    // const [firstAddress, remainingAddress] = item.display_name.split(/,(.+)/);
    // const fullAddress = `${firstAddress}\n${remainingAddress}`;

    setQuery(item.display_name);

    handlePress({
      latitude,
      longitude,
      address: item.display_name, 
    });
      
    console.log(item);

    saveRecentRide(item);
    fetchAddress(latitude, longitude); // Fetch reverse geocoded address
    setSearchResults([]); // Clear search results after selection
    setQuery(''); // Clear the input after selection

    if(title == "From"){
      router.push(`/(root)/find-end`)
    }else if(title == "To"){
      router.push(`/(root)/route-suggestion`)
    }

  };



  return (
    <View style={styles.container} className={`${containerStyle}`}>
      {/* Input Field for Searching Location */}
      <TextInput
        placeholder={initialLocation || "Search for a location"}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          searchLocations(text);
        }}
        style={[
          styles.input,
          { backgroundColor: textInputBackgroundColor || "white" }
        ]}
        multiline={true}  // Enable multiple lines
        numberOfLines={2}
      />

      {/* Left-side icon */}
      {icon && (
        <View style={styles.iconContainer}>
          <Image
            source={typeof icon === 'string' ? { uri: icon } : icon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      )}
      {/* Search Results */}
    {searchResults.length > 0 ? (
      <View>

        <Text className="pt-7 text-lg font-JakartaSemiBold absolute ">Recent</Text>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.resultsList}
          renderItem={({ item }) => {
            const [firstAddress, remainingAddress] = item.display_name.split(/,(.+)/);
            return (
            <TouchableOpacity onPress={() => handleLocationSelect(item)}>
              <View className="flex flex-row items-center space-x-1 pl-2 border-b-2 border-[#A5D6A7] mt-4">
                <Image
                  source={icons.point}
                  style={styles.icon}
                />

              <Text className="p-2">
                 <Text style={styles.resultTextFirst}>{firstAddress}</Text>
                {'\n'}
                <Text style={styles.resultTextLast}>{remainingAddress}</Text>
              </Text>         
              </View>
               
            </TouchableOpacity>
            )
          }}        />
          </View>
      ) :

      (
        <View >
        <Text className="pt-7 text-lg font-JakartaBold absolute text-white">Recent</Text>
        <FlatList
          data={recentRides}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.resultsList}
          renderItem={({ item }) => {
            const [firstAddress, remainingAddress] = item.display_name.split(/,(.+)/);
            return (
            <TouchableOpacity onPress={() => handleLocationSelect(item)}>
              <View className="flex flex-row items-center px-2 justify-between border-b-2 border-[#A5D6A7]  ">
                <View className="flex flex-row">
              <Image
                  source={icons.recentPin}
                  style={styles.icon}
                  className="mt-4"
                />

              <Text className="p-2 w-[87%]">
                 <Text style={styles.resultTextFirst}>{firstAddress}</Text>
                {'\n'}
                <Text style={styles.resultTextLast}>{remainingAddress}</Text>
              </Text>  
              </View>
              <TouchableOpacity onPress={() => deleteData(item)} className="flex justify-end items-center">
              <Image
                source={icons.bin}  
                className="w-6 h-6"  
              />
            </TouchableOpacity>    
              </View>
            </TouchableOpacity>
          )
        }}
          
        />
         </View>
      )
      }
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 10,
    zIndex:50
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    width: "100%",
    borderRadius: 10,
    paddingLeft: 40,
    height: 50,
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  icon: {
    width: 24,
    height: 24,
  },
  resultsList: {
    position: "absolute",
    top: 70,
    width: "100%",
    borderRadius: 10,
    shadowColor: "#d4d4d4",
    backgroundColor:"white",
    zIndex: 99,
  },
  resultTextFirst: {
    fontSize: 16,
    fontWeight:"bold",
    
  }, 
  resultTextLast: {
    fontSize: 16,
  },
  addressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    width: '100%', 
    paddingHorizontal: 10, 
    textAlign: "left", 
  },
});

export default OpenStreetTextInput;
