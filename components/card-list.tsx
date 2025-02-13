import { View, Text, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { ForecastResponse } from '@/api/weather'
import { weatherStyles as styles } from '@/styles/weatherStyles'

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
    <View style={CardStyles.container}>
      {data.list.map((item, index) => {
        return (
          <View key={index} style={CardStyles.subContainer}>
            <Text style={styles.detailsText}>{new Date(Number(item.dt) * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true, // Ensures AM/PM format
            })}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`,
              }}
              style={{ width: 50, height: 50, alignSelf: "center" }}
            />
            <Text style={styles.detailsText}>{item.main.temp}</Text>
            <Text style={styles.detailsText}>{item.main.feels_like}</Text>
          </View>
        )
      })}

    </View>
  )
}

const CardStyles = StyleSheet.create({
  container: {
    // flex: 1 / 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#D8DAFF',
    borderRadius: 10,
  }
})