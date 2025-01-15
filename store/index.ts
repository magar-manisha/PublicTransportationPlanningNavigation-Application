import {create} from "zustand";

import { RouteStore, BusStore, LocationStore, BusData, Route, StopStore, BusLocationStore, BusLocationProp} from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address,
        }));

        const {selectedRoute, clearSelectedRoute} = useRouteStore.getState();
        if (selectedRoute) clearSelectedRoute();
    },

    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address,
        }));
    },
}));



export const useStopStore = create<StopStore>((set) => ({
    startStops: [],
    endStops: [],
  
    setStartStops: (stops: {stop_id:string; latitude: number; longitude: number; stop_name: string }[]) => {
      set(() => ({
        startStops: stops,
      }));
    },
  
    setEndStops: (stops: {stop_id:string; latitude: number; longitude: number; stop_name: string }[]) => {
      set(() => ({
        endStops: stops,
      }));
    },

    clearStops: () => {
      set({ startStops: [], endStops: [] });
    },
  }));
  
  

//   export const useBusStore = create<BusStore>((set) => ({
//     buses: [] as BusData[],
//     setBuses: (buses) => set({ buses }),
//     updateBusLocation: (busId, location) =>
//       set((state) => ({
//         buses: state.buses.map((bus) =>
//           bus.bus_id === busId ? { ...bus, location } : bus
//         ),
//       })),
//     clearSelectedBus: () => set({ buses: [] }),
//   }
// ));
export const useBusLocationStore = create<BusLocationStore>((set) => ({
  buseslocation: [] as BusLocationProp[],  // Initialize with an empty array
  
  updateBusLocation: (busLocation) =>
    set((state) => {
      const busIndex = state.buseslocation.findIndex((bus) => bus.bus_id === busLocation.bus_id);

      if (busIndex >= 0) {
        const updatedBuses = [...state.buseslocation];
        updatedBuses[busIndex] = busLocation; 
        return { buseslocation: updatedBuses };
      } else {
        return { buseslocation: [...state.buseslocation, busLocation] }
      }
    }),

  clearSelectedBus: () => set({ buseslocation: [] }),
}));


export const useRouteStore = create<RouteStore>((set) => ({
    routes: [] as Route[],
    selectedRoute: null as Route | null,
    setRoutes: (routes: Route[]) => set({ routes }),
    setSelectRoute: (route: Route) => set({ selectedRoute: route }),
    clearSelectedRoute: () => set({ selectedRoute: null }),
}));


const initialState = {
  someState: null,
  anotherState: [],
  // Add other states as needed
};

export const useStore = create((set) => ({
  ...initialState,
  reset: () => set(() => ({ ...initialState })), // Reset Zustand store
}));