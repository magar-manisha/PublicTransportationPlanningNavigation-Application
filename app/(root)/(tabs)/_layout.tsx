import React from 'react'
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="find-bus" options={{ headerShown: false }} />
        <Stack.Screen name="find-issues" options={{ headerShown: false }} />
        <Stack.Screen name="find-poi" options={{ headerShown: false }} />
        <Stack.Screen name="find-map" options={{ headerShown: false }} />
    </Stack>
  )
}

export default Layout