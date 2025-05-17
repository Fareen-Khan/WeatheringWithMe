import CardList from "@/components/cardList";
import { RecommendedOutfit } from "@/components/reccomendedOutfit";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationHeader } from "@/components/locationHeader";
import { PillItem, WeatherPillBox } from "@/components/weatherPillBox";
import { WeatherSummary } from "@/components/weatherSummary";
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
  const pillItems: PillItem[] = [
    { value: data?.main.humidity ?? 0, symbol: "droplet", unit: "%" },
    { value: data?.wind?.speed ?? 0, symbol: "wind", unit: "m/s" },
  ]
  if (data?.snow) pillItems.push({ value: Math.round(data.snow["1h"]!), symbol: "cloud-snow", unit: "cm" })
  if (data?.rain) pillItems.push({ value: Math.round(data.rain["1h"]!), symbol: "cloud-rain", unit: "mm" })
  useEffect(() => {
    if (location && typeof location === "string") {
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
            <LocationHeader
              city={data.name}
              country={data.sys.country}
              onRefresh={fetchCurrentLocationAndWeather}
              searchRef={city}
            />
            <WeatherSummary
              feelsLike={data.main.feels_like}
              temp={data.main.temp}
              icon={data.weather[0].icon}
              unit="°C"
            />
            {/* Pill Box for extra info */}
            
            <WeatherPillBox
              items={pillItems}
            />
          </View>
          {/* ootd */}
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
