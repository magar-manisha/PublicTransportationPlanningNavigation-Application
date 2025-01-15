import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';

const Page = () => {

  LogBox.ignoreAllLogs();
  // const { isSignedIn } = useAuth()
  const [visited, setVisited] = useState<null | boolean>(null);


  useEffect(() => {
    const checkVisitStatus = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('hasVisited');
        if (hasVisited) {
          setVisited(true);
        } else {
          await AsyncStorage.setItem('hasVisited', 'true');
          setVisited(false);
        }
      } catch (error) {
        console.error('Error checking visit status:', error);
      }
    };

    checkVisitStatus();
  }, []);

  if (visited === null) {
    return null;
  }

  return visited ? 
    ( <Redirect href={'/(root)/(tabs)/home'} />)
  :
  ( <Redirect href="/(auth)/welcome" />)
}

export default Page;