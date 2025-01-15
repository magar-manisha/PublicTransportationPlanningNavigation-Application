import React from 'react'
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(driver)" options={{ headerShown: false }} />
        <Stack.Screen name="find-start" options={{ headerShown: false }} />
        <Stack.Screen name="find-end" options={{ headerShown: false }} />
        {/* <Stack.Screen name="trip-overview" options={{ headerShown: false }} /> */}
        <Stack.Screen name="trip-details" options={{ headerShown: false }} />
        <Stack.Screen name="app-setting" options={{ headerShown: false }} />
        <Stack.Screen name="route-suggestion" options={{ headerShown: false }} />
    </Stack>
  )
}

export default Layout