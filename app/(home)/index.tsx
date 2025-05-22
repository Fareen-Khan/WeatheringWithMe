import CardList from "@/components/cardList";
import { RecommendedOutfit } from "@/components/reccomendedOutfit";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import React, { useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationHeader } from "@/components/locationHeader";
import { WeatherPillBox } from "@/components/weatherPillBox";
import { WeatherSummary } from "@/components/weatherSummary";
import useOutfit from "@/hooks/useOutfit";
import useRandomOutfit from "@/hooks/useRandomOutfit";
import useWeather from "@/hooks/useWeather";
import { Theme } from "@/styles/Colors";


export default function Index() {
  const [isVisible, setIsVisible] = useState(false)
  const { data, forecast, loading, pillItems, refresh } = useWeather()
  const userOutfit = useOutfit(data?.main.feels_like)
  const outfit = useRandomOutfit(data?.main.feels_like)

  if (loading) { return <ActivityIndicator size="large" color="blue" />; }

  if (!data || !data.sys) { return <Text>Error loading weather data</Text>; }

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
            onRefresh={refresh}
            searchRef={data?.name}
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
