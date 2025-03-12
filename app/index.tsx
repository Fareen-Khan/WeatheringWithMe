import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, ImageBackground, Pressable } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import CardList from "@/components/card-list";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { WeatherResponse, ForecastResponse } from "@/utils/types";
import { getRandomOutfit } from "@/api/outfit";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outfit, setOutfit] = useState<string | null>(null);
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

  useEffect(() => {
    if (location && typeof location === "string") {
      console.log("Using searched location:", location);
      fetchWeatherForCity(location);
    } else {
      fetchCurrentLocationAndWeather();
    }
  }, [city]);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!data || !data.sys) {
    return <Text>Error loading weather data</Text>;
  }
  

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/night_time.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Top Section */}
        <SafeAreaView
          style={[styles.subContainer, styles.topContainer, { flex: 1, justifyContent: "space-between" }]}
        >
          <View style={styles.weatherInfo}>
            <View style={{ flexDirection: "row", gap: 10 , alignItems: "center" }}>
              <Link href={"/search"}>
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
              <View style={{ flexDirection: "row" }}>
                <Feather name="droplet" size={20} color="white" />
                <Text style={styles.detailsText}>{data.main.humidity}%</Text>
              </View>
              {/* Wind */}
              <View style={{ flexDirection: "row" }}>
                <Feather name="wind" size={20} color="white" />
                <Text style={styles.detailsText}>{data.wind?.speed != null ? Math.round(data.wind.speed) : "N/A"} m/s</Text>
              </View>
              {/* Snow (if present) */}
              {data.snow && (
                <View style={{ flexDirection: "row" }}>
                  <Feather name="cloud-snow" size={24} color="white" />
                  <Text style={styles.detailsText}>{Math.round(data.snow["1h"] ?? 0)} cm</Text>
                </View>
              )}
              {/* Rain (if present) */}
              {data.rain && (
                <View style={{ flexDirection: "row" }}>
                  <Feather name="cloud-rain" size={24} color="white" />
                  <Text style={styles.detailsText}>{Math.round(data.rain["1h"] ?? 0)} mm</Text>
                </View>
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
            <CardList data={forecast} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
