import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { getListofCities } from "@/api/weather";
import { GeoResponse } from "@/utils/types";

export default function Search() {
  const [location, setLocation] = useState("");
  const [locationResults, setLocationResults] = useState<GeoResponse[] | { cod: number; message: string }>([]); 
  useEffect(() => {
    const getResults = async () => {
      try {
        const searchResults = await getListofCities(location);
        setLocationResults(searchResults);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getResults()
  }, [location])
  return (
    <SafeAreaView >
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="black" />
        </Pressable>
        <TextInput
          style={styles.textInput}
          onChangeText={setLocation}
          value={location}
          placeholder="Enter A Location"
          autoFocus={true}
        />
        <Pressable onPress={() => {
          router.back()
          router.setParams({ location: location })
        }}>
          <Feather name="search" size={20} color="black" />
        </Pressable>
      </View>
      <View style={styles.resultsContainer}>
        {!Array.isArray(locationResults) && locationResults.cod === 400 ? (
          <></>
        ) : (
          Array.isArray(locationResults) &&
            locationResults.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "#ccc" : "transparent",
                    borderRadius: 10,
                    overflow: "hidden",
                  }
                ]
                }
                onPress={() => {
                  router.back()
                  router.setParams({ location: String(item.name+","+item.state+","+item.country) })
                }}>
              <Text key={index}>{item.name}, {item.state ?? "N/A"}, {item.country}</Text>
            </Pressable>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  searchText: {
    fontSize: 16,
    marginLeft: 8
  },
  resultsContainer: {
    alignItems: "center",
    gap: 10,
  },
});
