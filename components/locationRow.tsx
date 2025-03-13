import React, { useState, useEffect } from "react";
import { GeoResponse } from "@/utils/types";
import { Text, View, TextInput, StyleSheet, Pressable, ImageBackground, ScrollView } from "react-native";
import { router } from 'expo-router';
import { useFavorites } from "@/utils/favorites";
import { Feather, AntDesign } from '@expo/vector-icons';
import { Theme } from "@/styles/Colors"


type LocationRowProps = {
  isFavorite: boolean;
  data: GeoResponse[] | string[];
};


const buildCityQuery = (item: GeoResponse): string => {
  let cityQuery = item.name;
  if (item.country && item.country !== "N/A") {
    cityQuery += `,${item.country}`;
  }
  return cityQuery;
};

const searchResults = ({ data }: { data: GeoResponse[] }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  return (
    <>
      {data.map((item, index) => {
        const cityQuery = buildCityQuery(item);
        const isCityFavorited = favorites.includes(cityQuery);
        return (
          <View style={styles.row} key={index}>
            <Pressable
              onPress={() => {
                router.back();
                router.setParams({ location: cityQuery });
              }}
              style={({ pressed }) => [
                styles.rowButton,
                { backgroundColor: pressed ? "#695DA2" : "transparent" },
              ]}
            >
              <Text style={styles.rowText}>
                {item.name}, {item.state ?? "N/A"}, {item.country}
              </Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                if (isCityFavorited) {
                  await removeFavorite(cityQuery);
                  console.log(`Removed favorite: ${cityQuery}`);
                } else {
                  await addFavorite(cityQuery);
                  console.log(`Added favorite: ${cityQuery}`);
                }
              }}
            >
              {isCityFavorited ? (
                <AntDesign name="heart" size={20} color="white" />
              ) : (
                <Feather name="heart" size={20} color="white" />
              )}
            </Pressable>
          </View>
        );
      })}
    </>
  )
}

const favoritesResults = ({ favorites }: {favorites:string[]}) => {
  const { removeFavorite } = useFavorites();
  return (
    <>
      {favorites.length > 0 ? (
        favorites.map((item, index) => (
          <View style={styles.row} key={index}>
            <Pressable
              onPress={() => {
                router.back();
                router.setParams({ location: item });
              }}
              style={({ pressed }) => [
                styles.rowButton,
                { backgroundColor: pressed ? "#695DA2" : "transparent" },
              ]}
            >
              {/* Display the city and country. Assumes the favorite string is "City,Country" */}
              <Text style={styles.rowText}>
                {item.split(",")[0]}, {item.split(",")[1]}
              </Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                await removeFavorite(item);
                console.log(`Removed favorite: ${item}`);
              }}
            >
              <AntDesign name="heart" size={20} color="white" />
            </Pressable>
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>No favorites yet.</Text>
      )}
    </>
  )
}

export const LocationRow = ({ isFavorite, data }: LocationRowProps) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();


  if (!isFavorite) {
    const geoData = data as GeoResponse[];
    return (
      searchResults({ data: geoData })
    )
  }

  return (
    favoritesResults({ favorites })
  )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  rowButton: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  rowText: {
    fontSize: 16,
    color: Theme.base.lightA0,
    padding: 10,
  },
  infoText: {
    fontSize: 16,
    color: Theme.base.lightA0,
    padding: 10,
  },
});