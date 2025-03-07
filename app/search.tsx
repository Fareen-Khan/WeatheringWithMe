import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Pressable, ImageBackground, ScrollView } from "react-native";
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { getListofCities } from "@/api/weather";
import { GeoResponse } from "@/utils/types";
import { Theme } from "@/constants/Colors"


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
    <ImageBackground
      source={require("@/assets/images/night_time.png")}
      style={styles.bgImage}
      resizeMode="cover"
      blurRadius={10}
    >
      <SafeAreaView style={{ flex: 1}}>
        <View style={[styles.container]}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="white" />
          </Pressable>
          <TextInput
            style={styles.textInput}
            onChangeText={setLocation}
            value={location}
            placeholder="Enter A Location"
            placeholderTextColor={Theme.base.lightA0}
            autoFocus={true}
          />
        </View>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {!Array.isArray(locationResults) && locationResults.cod === 400 ? (
            <></>
          ) : (
            Array.isArray(locationResults) &&
              locationResults.map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#695DA2" : "transparent",
                      borderRadius: 10,
                      overflow: "hidden",
                      width: "100%",
                      alignSelf: "center",
                      paddingHorizontal: 10,
                      marginVertical: 10,
                    }
                  ]
                  }
                  onPress={() => {
                    router.back()
                    let cityQuery = item.name;
                    if (item.country && item.country !== "N/A") {
                      cityQuery += `,${item.country}`;
                    }
                    router.setParams({ location: cityQuery });
                  }}>
                <Text style={{ fontSize: 16, color: Theme.base.lightA0, padding: 10}}>{item.name}, {item.state ?? "N/A"}, {item.country}</Text>
              </Pressable>
            ))
          )}
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
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    padding: 10,
    color: Theme.base.lightA0,
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
