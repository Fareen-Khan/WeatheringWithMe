import React, { useEffect, useState, useCallback } from "react";
import { Text, View, Image, ActivityIndicator, ImageBackground, Pressable, Modal, Button } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import CardList from "@/components/card-list";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { WeatherResponse, ForecastResponse, ClothingItem, Tag, Outfit } from "@/utils/types";
import { getRandomOutfit } from "@/api/outfit";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import { WeatherSymbol } from "@/components/weatherSymbol";
import { RecommendedOutfit } from "@/components/reccomendedOutfit";

import { getAllClothingItems, getTagsForItems, deleteClothingItem, getAllTags, getItemsForTag } from "@/utils/db";
import { Theme } from "@/styles/Colors";


export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outfit, setOutfit] = useState<string | null>(null);

  const [userOutfit, setUserOutfit] = useState<Outfit | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Extract location from search params and default to "Toronto" if not provided
  const { location } = useLocalSearchParams();
  // Default to Toronto if location is not provided and user not searching
  const city = typeof location === "string" ? location : "Toronto";

  // A helper function to fetch weather by a city name.
  const fetchWeatherForCity = async (cityName: string) => {
    try {
      const weatherData = await getCurrentWeather(cityName);
      const forecastData = await get5DayForecast(cityName);
      setForecast(forecastData as ForecastResponse);
      setData(weatherData as WeatherResponse);
      setOutfit(getRandomOutfit(weatherData.main.temp));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // get current location and fetch weather for it
  const fetchCurrentLocationAndWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Fall back to a default city if permission isn't granted.
        fetchWeatherForCity("Toronto");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(currentLocation.coords);
      if (geocode.length > 0 && geocode[0].city) {
        // Combine city and country into a string
        const userCity = geocode[0].city;
        const userCountry = geocode[0].isoCountryCode;
        fetchWeatherForCity(`${userCity},${userCountry}`);
      } else {
        // If geocoding fails, fallback to a default city.
        fetchWeatherForCity("Toronto");
      }
    } catch (error) {
      console.error("Error retrieving location:", error);
      // Fallback in case of error.
      fetchWeatherForCity("Toronto");
    }
  };

  function getSeasonByTemp(temp: number): "Winter" | "Fall" | "Spring" | "Summer" {
    if (temp < 8) {
      return "Winter"    // chilly, needs heavy layers
    } else if (temp < 15) {
      return "Fall"      // cool → light jacket or sweater
    } else if (temp < 22) {
      return "Spring"    // mild → long sleeves or light top
    } else {
      return "Summer"    // warm/hot → short sleeves
    }
  }


  // pick random
  function pickRandom<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // get an outfit (hat, shirt,pants, shoes) for the current season
  async function getOutfit(temp: number) {
    const currentTag = getSeasonByTemp(temp)
    const items = await getItemsForTag(currentTag)

    // get random outfit from the items
    const shirt = pickRandom(items.filter(i => i.type === "Shirt"))
    const pants = pickRandom(items.filter(i => i.type === "Pants"))
    const shoes = pickRandom(items.filter(i => i.type === "Shoe"))
    const headwear = pickRandom(items.filter(i => i.type === "Headwear"))
    // console.log(currentTag)
    // console.log("outfit: ", shirt, pants, shoes, headwear)
    return { shirt, pants, shoes, headwear }
  }

  useEffect(() => {
    if (location && typeof location === "string") {
      // console.log("Using searched location:", location);
      fetchWeatherForCity(location);
    } else {
      fetchCurrentLocationAndWeather();
    }
  }, [city]);

  useFocusEffect(
    useCallback(() => {
      if (data?.main) {
        getOutfit(data.main.feels_like).then(setUserOutfit)
      }
    }, [data])
  )

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!data || !data.sys) {
    return <Text>Error loading weather data</Text>;
  }

  // ---- VIEW ----
  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]} >
      <ImageBackground
        source={require("@/assets/images/night_time.png")}
        style={[styles.bgImage, { flex: 1 }]}
        resizeMode="cover"
      >
        {/* Top Section */}
        <SafeAreaView
          style={[styles.subContainer, styles.topContainer, { flex: 1, justifyContent: "space-between" }]}
          edges={["top", "bottom"]}
        >
          <View style={styles.weatherInfo}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Link href={"/(home)/search"}>
                <Feather name="search" size={20} color="white" />
                <Text style={styles.locationText}>
                  {data.name}, {data.sys.country}
                </Text>
              </Link>
              <Pressable onPress={() => {
                fetchCurrentLocationAndWeather()
              }}>
                <Feather name="map-pin" size={20} color="white" />
              </Pressable>
            </View>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
              }}
              style={styles.icon}
            />
            <Text style={styles.tempText}>{Math.round(data.main.feels_like)}°C</Text>
            <Text style={styles.detailsText}>
              Actual: {Math.round(data.main.temp)}°C
            </Text>
            {/* Pill Box for extra info */}
            <BlurView style={styles.pillBox}>
              {/* Humidity */}
              <WeatherSymbol
                data={data.main.humidity}
                symbol="droplet"
                unit="%"
              />
              {/* Wind */}
              <WeatherSymbol
                data={data.wind?.speed ?? 0}
                symbol="wind"
                unit="m/s"
              />
              {/* Snow (if present) */}
              {data.snow && (
                <WeatherSymbol
                  data={Math.round(data.snow["1h"] ?? 0)}
                  symbol="cloud-snow"
                  unit="cm"
                />
              )}
              {/* Rain (if present) */}
              {data.rain && (
                <WeatherSymbol
                  data={Math.round(data.rain["1h"] ?? 0)}
                  symbol="cloud-rain"
                  unit="mm"
                />
              )}
            </BlurView>
          </View>
          {/* ootd */}
          {/* TODO: add fallback image */}
          <Image
            source={outfit != null ? outfit : require("@/assets/images/outfits/1-2.png")}
            style={{
              // flex: 1,
              height: "45%",
              resizeMode: "contain",
            }}
          />
          {/* Should be at bottom of screen*/}
          <View style={{ paddingHorizontal: 10 }}>
            <Pressable
              onPress={()=> setIsVisible(true)}
              style={{
                marginTop: 16,
                alignSelf: "center",
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: "#ddd",
                borderRadius: 20,
              }}
            >
              <Text style={[styles.detailsText, {color: Theme.base.darkFadedA0}]}>See suggested outfit</Text>
            </Pressable>
            <RecommendedOutfit
              visible={isVisible}
              outfit={userOutfit}
              onClose={() => setIsVisible(false)}
            />
            <CardList data={forecast} />
          </View>
        </SafeAreaView>
        <SafeAreaView style={{ opacity: 0 }} />
      </ImageBackground>

    </View>

  );
}
