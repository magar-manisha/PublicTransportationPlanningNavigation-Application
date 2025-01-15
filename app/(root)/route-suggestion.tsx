import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";

import RideLayout from "@/components/RideLayout";
import { useLocationStore, useRouteStore, useStopStore } from "@/store";
import RouteCard from "@/components/RouteCard";
import { Route } from "@/types/type";
import { useEffect, useState } from "react";


const RouteSuggestion = ( ) => {

  const { routes, setRoutes, selectedRoute, setSelectRoute } = useRouteStore();

  const {
    startStops,
    endStops,
  } = useStopStore();

  const [data, setData] = useState<Route[] | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchRoutes = async () => {
    if (!startStops || startStops.length === 0) return;
    if (!endStops || endStops.length === 0) return;
  
    setLoadingRoutes(true);
    try {
      console.log("Starting to fetch");
      
      for (const start of startStops) {
        for (const end of endStops) {
          try {
            const response = await fetch("/(api)/route/busRoute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                start_lat: start.latitude,
                start_lon: start.longitude,
                destination_lat: end.latitude,
                destination_lon: end.longitude,
              }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const routeResult = await response.json();
            setData(routeResult.data);
            console.log(routeResult.data)
          } catch (error) {
            console.error(`Error fetching route from  ${start.stop_name} to ${end.stop_name}:`, error);
          }
        }
      }  
      console.log("Routes are completed successfully:");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingRoutes(false);
    }
  };
  


  useEffect(() => {
      fetchRoutes();
  }, [startStops, endStops]); 


  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(routes)) {
      setRoutes(data); 
    }
  }, [data, routes, setRoutes]);
  






  return (
    <RideLayout title="Choose a ride" snapPoints={["20%","80%"]}>



      <Text className="font-JakartaBold text-2xl pb-3 text-white"> Suggested </Text>

      <FlatList
        data={routes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <RouteCard
            item={item}
            selected={selectedRoute?.route_id!} 
            setSelected={() => setSelectRoute(item!)}
          />
        )}
      />
    </RideLayout>
  )
}

export default RouteSuggestion;