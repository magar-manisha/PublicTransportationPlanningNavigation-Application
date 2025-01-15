import React from 'react'
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name="driver-home" options={{ headerShown: false }} />
    </Stack>
  )
}

export default Layout