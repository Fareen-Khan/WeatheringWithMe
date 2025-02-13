import { Text, View, Image, ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import Card from "@/components/card";
import { getCurrentWeather } from "@/api/weather";
import { useEffect, useState } from "react";
import { WeatherResponse } from "@/api/weather";

export default function Index() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getCurrentWeather("Toronto");
        setData(data);
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
    <View
      style={styles.container}
    >
      <View style={[styles.subContainer, styles.lightPurple]}>
        <Text>{data.name}</Text>
        <Image source={{
          uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        }}
        style={styles.icon}
        />
        <Text>Temperature: {data.main.temp}°C</Text>
        <Text>Humidity: {data.main.humidity}%</Text>
        <Text>Feels like: {data.main.feels_like}°C</Text>
      </View>
      <View style={[styles.subContainer, styles.darkPurple]}>
        <Text>Next 4 Hours</Text>
        <Card />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lightPurple: {
    flex: 2,
    backgroundColor: "#D8DAFF",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  darkPurple: {
    flex: 1,
    backgroundColor: "#AAB7FD",
    marginTop: -40,
    zIndex: -1,
  },
  icon: {
    width: 100,
    height: 100,
  }
});
