import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number;
}

declare interface Bus{
  bus_id: number;
  bus_number: string;
  capacity: number;
  driver_id: number;
  route_id: number;
}

declare interface BusStore {
  buses: BusData[];
  setBuses: (buses: BusData[]) => void;
  updateBusLocation: (busId: number, location: BusLocationProp) => void;
  clearSelectedBus: () => void
}

declare interface BusLocationStore {
  buseslocation: BusLocationProp[];
  updateBusLocation: (busLocation: BusLocationProp) => void;
  clearSelectedBus: () => void
}

declare interface BusLocationProp{
  bus_id: number;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
  estimated_arrival_time: string;
  driver_id: number;
  route_id: number;
}


declare interface BusData {
  bus_id:number;
  bus_number: string;
  capacity: number;
  driver_id: number;
  route_id: number;
  location?:BusLocationProp
}

declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onBusTimesCalculated?: (busWithTimes: MarkerData[]) => void;
  selectedBus?: number | null;
  onMapReady?: () => void;
}

declare interface Ride {
  route_id: number;
  route_name: string;
  start_location: string;
  start_latitude: number;
  start_longitude: number;
  end_location: string;
  end_latitude: number;
  end_longitude: number;
  user_id?:string;
  estimated_time?: number ; 
  frequency?: number ;
  fare_amount?: number;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  title?:string
}



export interface OpenStreetPlace {
  place_id: string; // or number, depending on the API response
  display_name: string;
  lat: string; // or number
  lon: string; // or number
  title?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    county?: string;
    country?: string;
  };
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface StopStore {
  startStops: Stop[]; 
  endStops: Stop[];   
  setStartStops: (stops: Stop[]) => void; 
  setEndStops: (stops: Stop[]) => void;
  clearStops: () => void;
}


declare interface BusCardProps {
  item: MarkerData;
  selected: number;
  setSelected: () => void;
}



declare interface  Stop {
  stop_id: string;
  stop_name: string;
  latitude: number;
  longitude: number;
}

interface StopCalc {
  location: {
    lat: number;
    lon: number;
  };
  duration: number; 
}

declare interface BusRouteProps {
  item: Route;
  selected: number | null;
  setSelected: () => void;
}


declare interface Route {
  route_id: number;
  route_name: string;
  start_location: string;
  start_latitude: number;
  start_longitude: number;
  end_location: string;
  end_latitude: number;
  end_longitude: number;
  estimated_time: number ; 
  frequency: number ;
  fare_amount: number;
}

declare interface RouteStore {
  routes: Route[];
  selectedRoute:  Route| null;
  setRoutes: (routes: Route[]) => void;
  setSelectRoute: (route: Route) => void;
  clearSelectedRoute: () => void;
}


declare interface StopType {
  stop_id: number;
  stop_order: number;
  stops: {
    stop_name: string;
    latitude: number;
    longitude: number;
  };
}

// declare interface BusType {
//   buses:{
//   bus_id: number;
//   // bus_number: string;
//   capacity: number;
//   };
// }

declare interface RouteData {
  stops: StopType[];
  buses: BusLocationProp[];
}
