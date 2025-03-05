import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, ImageBackground } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import CardList from "@/components/card-list";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { WeatherResponse, ForecastResponse } from "@/api/weather";
import { getRandomOutfit } from "@/api/outfit";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outfit, setOutfit] = useState<string | null>(null);
  // Extract location from search params and default to "Toronto" if not provided
  const { location } = useLocalSearchParams();
  const city = typeof location === "string" ? location : "Toronto";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log("Fetching weather for:", city);
        const data = await getCurrentWeather(city);
        const forecastData = await get5DayForecast(city);
        setForecast(forecastData as ForecastResponse);
        setData(data as WeatherResponse);
        setOutfit(getRandomOutfit(data.main.temp));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!data) {
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
            <Link href={"/search"}>
              <Feather name="search" size={20} color="white" />
              <Text style={styles.locationText}>
                {data.name}, {data.sys.country}
              </Text>
            </Link>
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
                <Feather name="droplet" size={20} color="black" />
                <Text style={styles.detailsText}>{data.main.humidity}%</Text>
              </View>
              {/* Wind */}
              <View style={{ flexDirection: "row" }}>
                <Feather name="wind" size={20} color="black" />
                <Text style={styles.detailsText}>{data.wind?.speed != null ? Math.round(data.wind.speed) : "N/A"} m/s</Text>
              </View>
              {/* Snow (if present) */}
              {data.snow && (
                <View style={{ flexDirection: "row" }}>
                  <Feather name="cloud-snow" size={24} color="black" />
                  <Text style={styles.detailsText}>{Math.round(data.snow["1h"] ?? 0)} cm</Text>
                </View>
              )}
              {/* Rain (if present) */}
              {data.rain && (
                <View style={{ flexDirection: "row" }}>
                  <Feather name="cloud-rain" size={24} color="black" />
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
