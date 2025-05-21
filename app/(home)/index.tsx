import { get5DayForecast, getCurrentWeather } from "@/api/weather";
import CardList from "@/components/cardList";
import { RecommendedOutfit } from "@/components/reccomendedOutfit";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { getRandomOutfit } from "@/utils/outfit";
import { ForecastResponse, Outfit, WeatherResponse } from "@/utils/types";
import * as Location from "expo-location";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationHeader } from "@/components/locationHeader";
import { PillItem, WeatherPillBox } from "@/components/weatherPillBox";
import { WeatherSummary } from "@/components/weatherSummary";
import { Theme } from "@/styles/Colors";
import { getItemsForTag } from "@/utils/db";


export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outfit, setOutfit] = useState<string | null>(null);

  const [userOutfit, setUserOutfit] = useState<Outfit | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const pillItems: PillItem[] = [
    { value: data?.main.humidity ?? 0, symbol: "droplet", unit: "%" },
    { value: data?.wind?.speed ?? 0, symbol: "wind", unit: "m/s" },
  ]
  if (data?.snow) pillItems.push({ value: Math.round(data.snow["1h"]!), symbol: "cloud-snow", unit: "cm" })
  if (data?.rain) pillItems.push({ value: Math.round(data.rain["1h"]!), symbol: "cloud-rain", unit: "mm" })

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
    <ImageBackground
      source={require("@/assets/images/night_time.png")}
      style={[styles.bgImage]}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{ justifyContent: "space-between", alignItems: "center", flex: 1 }}
        edges={["top"]}
      >
        <View style={{ alignItems: "center" }}>
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
          <WeatherPillBox
            items={pillItems}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Image
            source={outfit != null ? outfit : require("@/assets/images/outfits/1-2.png")}
            style={{ height: "100%", resizeMode: "contain" }}
          />
        </View>

        <View>
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
    </ImageBackground>

  );
}
