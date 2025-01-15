import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const userRole = () => {
  const setPassanger = ()=>{
    router.replace("/(root)/(tabs)/home");

  }

  const setDriver = ()=>{
    router.replace("/(root)/(driver)/driver-home");
  }

  return (
  
  <View className='flex h-screen bg-[#006600] items-start' >
    <View className='p-5 pt-40 '>
      <Text className='text-xl text-white font-JakartaExtraBold'>Role</Text>
      <TouchableOpacity onPress={setPassanger} className='w-80 bg-[#E9C05E] rounded-lg shadow-2xl shadow-zinc-100 mt-3 p-10'><Text className='text-white text-xl font-JakartaBold'>Passanger</Text></TouchableOpacity>
      <TouchableOpacity onPress={setDriver} className='w-80 bg-[#E9C05E] rounded-lg shadow-2xl shadow-zinc-100 mt-10 p-10'><Text className='text-white text-xl font-JakartaBold'>Driver</Text></TouchableOpacity>
    </View>
    </View>
  )
}

export default userRole