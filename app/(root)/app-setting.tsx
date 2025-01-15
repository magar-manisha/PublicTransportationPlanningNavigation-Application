import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { icons } from "@/constants";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Route } from 'expo-router/build/Route';
import { router } from 'expo-router';


const AppSetting = () => {
  interface SettingOption {
    icon?: any;
    label: string;
    onPress: () => void;
  }

  const settingsOptions: SettingOption[] = [
    { icon: icons.twitter, label: 'Contact Us', onPress: () => console.log('Link to Contact') },
    { icon: icons.semail, label: '@sahayatri on Twitter', onPress: () => console.log('Open Twitter') },
    { icon: icons.sShare, label: 'Share the App', onPress: () => console.log('Share link') },
    { icon: icons.playStore, label: 'Rate the App', onPress: () => console.log('Open app rating') },
    { icon: icons.work, label: 'Work at Sahayatri', onPress: () => console.log('Open careers link') },
    { label: 'Privacy Policy', onPress: () => console.log('Open Privacy Policy') },
    { label: 'Privacy Settings', onPress: () => console.log('Open Privacy Settings') },
    { label: 'Terms of Service', onPress: () => console.log('Open Terms of Service') },
    { label: 'Data Sources', onPress: () => console.log('Open Data Sources') },
    { label: 'Acknowledgements', onPress: () => console.log('Open Acknowledgements') },
  ];

  const goTosignIn= () =>{
    // router.push("/(auth)/sign-up")
    router.push("/(auth)/user-role")
  }

  return (
      <View className="flex-1 p-5 ">
        <View>
  
        {/* Heading */}
        <Text className="text-xl font-bold text-center mt-5 mb-4">App Settings</Text>
  
        {/* Option - City */}
        <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <Text className="text-lg text-gray-800">Koshi</Text>
          <Text className="text-base text-blue-600">Province</Text>
        </View>
  
        {/* Option - Account */}
        <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <Text className="text-lg text-gray-800">Account</Text>
          <TouchableOpacity onPress={goTosignIn}><Text className='text-blue-600 text-base'>SignUP</Text></TouchableOpacity>
        </View>
  
        {/* Option - Remove Ads */}
        <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <Text className="text-lg text-gray-800">Remove Ads</Text>
          <Text className="text-base text-blue-600">RS.100/month</Text>
        </View>

  
        {/* Stats Section */}
        <View className="flex-row justify-around mt-6 p-4 bg-[#f5dd8d] rounded-lg shadow-md">
          <View className="items-center">
            <Text className="text-2xl font-bold">0</Text>
            <Text className="text-sm text-gray-500">Calories</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">0</Text>
            <Text className="text-sm text-gray-500">CO₂ Saved</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">0</Text>
            <Text className="text-sm text-gray-500">Saved</Text>
          </View>
        </View>

        </View>


        <View>
        {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          }}
          onPress={option.onPress}
        >
          {option.icon &&  <Image
              source={option.icon} 
              resizeMode="contain" 
              className="w-5 h-5 "  
            />}
          <Text className="text-lg text-gray-800 pl-3">{option.label}</Text>
        </TouchableOpacity>
      ))}
      <Text className="text-center text-sm text-gray-500 mt-5">Version 11.25</Text>
      <View className="mt-10 items-center">
        {/* Add a footer image or additional content here */}
      </View>

        </View>
      </View>


  )
}

export default AppSetting;