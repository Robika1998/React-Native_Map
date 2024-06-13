import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, View, Button } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as Location from "expo-location";

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.7792,
    longitude: 44.7797,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState([
    {
      id: 1,
      title: "Marker 1",
      coordinates: { latitude: 41.7792, longitude: 44.7797 },
    },
    {
      id: 2,
      title: "Marker 2",
      coordinates: { latitude: 41.7993, longitude: 44.7661 },
    },
  ]);

  const [routes, setRoutes] = useState([]);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(
      "Current Location:",
      location.coords.latitude,
      location.coords.longitude
    );
  };

  useEffect(() => {
    userLocation();
  }, []);

  const renderMarkers = () => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        coordinate={marker.coordinates}
        title={marker.title}
      >
        <EvilIcons name="location" size={40} color="red" />
      </Marker>
    ));
  };

  const calculateRoute = () => {
    const routeCoordinates = markers.map((marker) => marker.coordinates);
    setRoutes(routeCoordinates);
  };

  const clearRoute = () => {
    setRoutes([]);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        {renderMarkers()}
        {routes.length > 0 && (
          <Polyline coordinates={routes} strokeColor="#000" strokeWidth={6} />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Calculate Route" onPress={calculateRoute} />
        <Button title="Clear Route" onPress={clearRoute} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});
