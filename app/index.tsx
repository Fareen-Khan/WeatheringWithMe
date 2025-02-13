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
    <View style={[styles.subContainer, styles.lightPurple]}>
      <Text style={styles.locationText}>{data.name}, {data.sys.country}</Text>

      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
        }}
        style={styles.icon}
      />

      {/* Group text elements together */}
      <View style={styles.weatherInfo}>
        <Text style={styles.tempText}>{data.main.temp}°C</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={{ textAlign: "center" }}>Humidity:{"\n"}{data.main.humidity}%</Text>
          <Text style={{ textAlign: "center" }}>Feels like:{"\n"}{data.main.feels_like}°C</Text>
          {data.snow && <Text style={{ textAlign: "center" }}>Precipitation:{"\n"}{data.snow?.["1h"]} cm</Text>}
          {data.rain && <Text style={{ textAlign: "center" }}>Precipitation:{"\n"}{data.rain?.["1h"]} cm</Text>}

        </View>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensures it takes the full width
  },
  lightPurple: {
    flex: 2,
    backgroundColor: "#D8DAFF",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start", // Aligns everything to the top
    paddingVertical: 20, // Reduce overall padding
  },
  darkPurple: {
    flex: 1,
    backgroundColor: "#AAB7FD",
    marginTop: -40,
    zIndex: -1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  icon: {
    width: 120, // Adjust as needed
    height: 120,
    alignSelf: "center",
    marginBottom: -20, // Adjust as needed
    backgroundColor: "transparent", // Remove background color
  },
  locationText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A228F",
    opacity: 0.7,
    // textAlign: "center", // Ensures text stays centered
  },
  tempText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A228F",
    marginTop: 5, // Add small spacing
  },
  forecastContainer: {
    flexDirection: "row",
    // justifyContent: "space-evenly", // Ensures spacing between cards
    width: "100%",
    paddingVertical: 10,
  },
  weatherInfo: {
    alignItems: "center", // Ensures text stays centered
    gap: 5, // Adds equal spacing between elements
  },
});

