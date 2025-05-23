import { LocationRow } from "@/components/locationRow";
import useLocationSearch from "@/hooks/useLocationSearch";
import { Theme } from "@/styles/Colors";
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [location, setLocation] = useState("");
  const {locationResults, error} = useLocationSearch(location)

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
            error ? (
              <></>
            ) : (
              Array.isArray(locationResults) &&
              <>
                <LocationRow isFavorite={false} data={locationResults} />
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
