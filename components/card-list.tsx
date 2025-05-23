import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import { ForecastResponse } from "@/utils/types";
import { weatherStyles as styles } from "@/styles/weatherStyles";

interface CardProps {
  data: ForecastResponse | null;
}

export default function CardList({ data }: CardProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!data) {
    return <Text>Error loading weather data</Text>;
  }

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.cardContainer}
      style={{ flexGrow: 0 }}
    >
      {data.list.map((item, index) => (
        <View key={index} style={styles.cardSubContainer}
        >
          <Text style={styles.detailsText}>
            {
              new Date(item.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
              })
            }
          </Text>
          <Text style={styles.detailsText}>
            {
              new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })}
          </Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
            }}
            style={{ width: 50, height: 50, alignSelf: "center" }}
          />
          <Text style={styles.subDetailsText}>Feels Like: </Text>
          <Text style={styles.detailsText}>{Math.round(item.main.feels_like)}°C</Text>
        </View>
      ))}
    </ScrollView>
  );
}
