import { getListofCities } from "@/api/weather";
import { LocationRow } from "@/components/locationRow";
import { Theme } from "@/styles/Colors";
import { GeoResponse } from "@/utils/types";
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [location, setLocation] = useState("");
  const [locationResults, setLocationResults] = useState<GeoResponse[] | { cod: number; message: string }>([]);


  useEffect(() => {
    if (location.trim() === "") {
      console.log("location is empty showing favorites")
      return
    }
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
    <ImageBackground
      source={require("@/assets/images/night_time.png")}
      style={styles.bgImage}
      resizeMode="cover"
      blurRadius={10}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={Theme.colors.white} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            onChangeText={setLocation}
            value={location}
            placeholder="Enter A Location"
            placeholderTextColor={Theme.colors.white}
            autoFocus={true}
          />
        </View>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {(!location || location.trim() === "") ? (
            <LocationRow isFavorite={true} data={[]} />
          ) : (
            !Array.isArray(locationResults) && locationResults.cod === 400 ? (
              <></>
            ) : (
              Array.isArray(locationResults) &&
              <>
                <LocationRow isFavorite={false} data={locationResults as GeoResponse[]} />
              </>
            )
          )
          }
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
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
    borderColor: Theme.colors.lighterGray,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    padding: 10,
    color: Theme.colors.white,
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
    marginHorizontal: 10,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
});
