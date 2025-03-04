import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, ImageBackground } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import CardList from "@/components/card-list";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { WeatherResponse, ForecastResponse } from "@/api/weather";
import { getRandomOutfit } from "@/api/outfit";
import { BlurView } from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outfit, setOutfit] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getCurrentWeather("Toronto");
        const forecastData = await get5DayForecast("Toronto");
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
  }, []);

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
            <Text style={styles.locationText}>
              {data.name}, {data.sys.country}
            </Text>
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
                <Image
                  source={require("@/assets/icons/humidity.png")}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.detailsText}>{data.main.humidity}%</Text>
              </View>
              {/* Wind */}
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={require("@/assets/icons/wind.png")}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.detailsText}>{data.wind?.speed != null ? Math.round(data.wind.speed) : "N/A"} m/s</Text>
              </View>
              {/* Snow (if present) */}
              {data.snow && (
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("@/assets/icons/snow.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={styles.detailsText}>{data.snow["1h"]} cm</Text>
                </View>
              )}
              {/* Rain (if present) */}
              {data.rain && (
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("@/assets/icons/rain.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={styles.detailsText}>{data.rain["1h"]} mm</Text>
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
