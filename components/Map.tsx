import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import MapView, { Callout, Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import polyline from "@mapbox/polyline"; // Import polyline decoder

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  // calculateDriverTimes,
  calculateRegion,
  // generateMarkersFromData,
  getRouteFromOSRM,
} from "@/lib/map";
import {  useBusLocationStore, useLocationStore, useRouteStore } from "@/store";
import { Bus, BusLocationProp, Driver, BusData, Stop } from "@/types/type";
import { supabase } from "@/lib/supabaseClient";
import { useBusLocationSubscription } from "@/lib/bus";

const OSRM_API_BASE_URL = "https://router.project-osrm.org/route/v1";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedRoute } = useRouteStore();
  const { buseslocation } = useBusLocationStore();

  const { data: stops } = useFetch<Stop[]>("/(api)/route/stop");

  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [userToStopRoute, setUserToStopRoute] = useState([]);
  const [stopToStopRoute, setStopToStopRoute] = useState([]);
  const [stopToDestinationRoute, setStopToDestinationRoute] = useState([]);

  console.log("This is buslocation from zustan",buseslocation);

  const fetchRoutes = async () => {
    if (
      selectedRoute &&
      userLatitude !== null &&
      userLongitude !== null &&
      destinationLatitude !== null &&
      destinationLongitude !== null &&
      selectedRoute.start_latitude !== null &&
      selectedRoute.start_longitude !== null &&
      selectedRoute.end_latitude !== null &&
      selectedRoute.end_longitude !== null
    ) {
      const userLat = Number(userLatitude);
      const userLon = Number(userLongitude);
      const destinationLat = Number(destinationLatitude);
      const destinationLon = Number(destinationLongitude);
      const startLat = Number(selectedRoute.start_latitude);
      const startLon = Number(selectedRoute.start_longitude);
      const endLat = Number(selectedRoute.end_latitude);
      const endLon = Number(selectedRoute.end_longitude);

      const userToStop = await getRouteFromOSRM(
        userLat,
        userLon,
        startLat,
        startLon
      );
      setUserToStopRoute(userToStop);

      // Get stop to stop route
      const stopToStop = await getRouteFromOSRM(
        startLat,
        startLon,
        endLat,
        endLon
      );
      setStopToStopRoute(stopToStop);

      // Get stop to destination route
      const stopToDestination = await getRouteFromOSRM(
        endLat,
        endLon,
        destinationLat,
        destinationLon
      );
      setStopToDestinationRoute(stopToDestination);
    }
  };

  useEffect(() => {
    if (
      userLatitude &&
      userLongitude &&
      destinationLatitude &&
      destinationLongitude &&
      selectedRoute
    ) {
      fetchRoutes();
    }
  }, [
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    selectedRoute,
  ]);

 
  useBusLocationSubscription();
  

  const fetchRouteFromOSRM = async () => {
    try {
      const response = await fetch(
        `${OSRM_API_BASE_URL}/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=polyline`
      );
      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0].geometry; // Polyline format
        const decodedRoute = polyline.decode(route); // Decode polyline into lat-lng pairs

        // Map decoded polyline to array of { latitude, longitude } objects
        const routeCoordinates = decodedRoute.map(
          ([latitude, longitude]: number[]) => ({
            latitude,
            longitude,
          })
        );

        setRouteCoordinates(routeCoordinates);
      }
    } catch (error) {
      console.error("Error fetching route from OSRM:", error);
    }
  };

  useEffect(() => {
    if (
      userLatitude &&
      userLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
      fetchRouteFromOSRM();
    }
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);




  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const MemoizedMarker = React.memo(
    ({
      coordinate,
      title,
      image,
    }: {
      coordinate: {
        latitude: number;
        longitude: number;
      };
      title: string;
      image?: any;
    }) => (
      <Marker coordinate={coordinate} title={title}>
        <View>
          <Image source={image} style={{ width: 32, height: 32 }} />
        </View>
      </Marker>
    )
  );


  return (
    <MapView
      provider={PROVIDER_DEFAULT} 
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={true}
      initialRegion={region}
      userInterfaceStyle="light"
      scrollEnabled={true}
      zoomEnabled={true}
    >
      {
      buseslocation &&
      buseslocation.length > 0 &&
      buseslocation.map((bus) => (
          <Marker
            key={bus.bus_id}
            coordinate={{
              latitude: bus.latitude,
              longitude: bus.longitude,
            }}
            title={bus.status}
            image={icons.marker}
          >
          <Callout>
          <View className="w-full">
            <Text>BUS{bus.bus_id}</Text>
          </View>
        </Callout></Marker>
        ))}

      {stops?.map((stop) => (
        <MemoizedMarker
          key={stop.stop_id}
          coordinate={{ latitude: +stop.latitude, longitude: +stop.longitude }}
          title={stop.stop_name}
          image={icons.busPin}
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <MemoizedMarker
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.endFlag}
          />

          {userToStopRoute && userToStopRoute.length > 0 && (
            <Polyline
              coordinates={userToStopRoute}
              strokeColor="black"
              strokeWidth={1}
            />
          )}

          {stopToStopRoute && stopToStopRoute.length > 0 && (
            <Polyline
              coordinates={stopToStopRoute}
              strokeColor="#4CAF50"
              strokeWidth={3}
            />
          )}

          {stopToDestinationRoute && stopToDestinationRoute.length > 0 && (
            <Polyline
              coordinates={stopToDestinationRoute}
              strokeColor="black"
              strokeWidth={1}
            />
          )}
        </>
      )}
    </MapView>
  );
};

export default Map;
