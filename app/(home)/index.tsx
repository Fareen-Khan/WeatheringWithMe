import CardList from "@/components/cardList";
import { RecommendedOutfit } from "@/components/reccomendedOutfit";
import { WeatherSymbol } from "@/components/weatherSymbol";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import Feather from '@expo/vector-icons/Feather';
import { BlurView } from 'expo-blur';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOutfit } from "@/hooks/useOutfit";
import { useWeather } from "@/hooks/useWeather";
import { Theme } from "@/styles/Colors";


export default function Index() {
  const [isVisible, setIsVisible] = useState(false)

  // TODO: move functions to a hooks folder

  // Extract location from search params and default to "Toronto" if not provided
  const { location } = useLocalSearchParams();
  // Default to Toronto if location is not provided and user not searching
  const city = typeof location === "string" ? location : "Toronto";

  const { data, forecast, loading, error, setCity, refetch, fetchCurrentLocationAndWeather } = useWeather(city)
  const { outfit, userOutfit, loading: outfitLoading, error: outfitError } = useOutfit(data?.main.feels_like ?? null)
  // setOutfit(getRandomOutfit(data?.main.feels_like ?? 0))

  useEffect(() => {
    if (location && typeof location === "string") {
      // console.log("Using searched location:", location);
      refetch();
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
              onPress={() => setIsVisible(true)}
              style={{
                marginTop: 16,
                alignSelf: "center",
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: "#ddd",
                borderRadius: 20,
              }}
            >
              <Text style={[styles.detailsText, { color: Theme.base.darkFadedA0 }]}>See suggested outfit</Text>
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
