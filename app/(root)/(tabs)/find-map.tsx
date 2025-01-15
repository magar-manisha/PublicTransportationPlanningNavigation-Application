import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons, images } from '@/constants'
import { router } from 'expo-router'

const findMap = () => {
  return (
    <View className='bg-[#F5F5F5]'>
       <View className="pt-5 bg-[#006600] h-36 px-5">
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
                  Map
                </Text>
              </View>
            </View>
      <View>
               <View className="flex flex-col items-center justify-center p-3">
                      <Image
                        source={images.province1}
                        className="w-full h-80"
                        alt="No recent rides found"
                        resizeMode="contain"
                      />
                      <Text className="text-lg font-JakartaExtraBold">Province No 1</Text>
                    </View>
              
            </View>
    </View>
  )
}

export default findMap