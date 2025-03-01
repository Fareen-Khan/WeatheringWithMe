import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, ImageBackground } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import CardList from "@/components/card-list";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { WeatherResponse, ForecastResponse } from "@/api/weather";
import {BlurView} from 'expo-blur';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getCurrentWeather("Toronto");
        const forecastData = await get5DayForecast("Toronto");
        setForecast(forecastData as ForecastResponse);
        setData(data as WeatherResponse);
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

  const currentHour = Math.floor(Date.now() / 1000);
  const backgroundImage =
    currentHour >= data.sys.sunset || currentHour <= data.sys.sunrise
      ? require("@/assets/images/night_time.png")
      : require("@/assets/images/day_time.png");
  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Top Section */}
        <SafeAreaView
          style={[styles.subContainer, styles.topContainer]}
        >
          <Text style={styles.locationText}>
            {data.name}, {data.sys.country}
          </Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
            }}
            style={styles.icon}
          />
          <View style={styles.weatherInfo}>
            <Text style={styles.tempText}>{data.main.feels_like}°C</Text>
            <Text style={styles.detailsText}>
              Actual: {data.main.temp}°C
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
                <Text style={styles.detailsText}>{data.wind?.speed} m/s</Text>
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
        </SafeAreaView>
      </ImageBackground>
      {/* Bottom Section (Forecast) */}
      <View style={[styles.subContainer, styles.bottomContainer]}>
        <CardList data={forecast} />
      </View>
    </View>
  );
}
