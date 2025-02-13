import { Text, View, Image, ActivityIndicator } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import Card from "@/components/card";
import { getCurrentWeather, get5DayForecast } from "@/api/weather";
import { useEffect, useState } from "react";
import { WeatherResponse, ForecastResponse } from "@/api/weather";

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

  return (
    <>
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
          {/* TODO: change feels like text style */}
          <Text style={styles.detailsText}>Feels like:{data.main.feels_like}°C</Text>
          <View style={styles.pillBox}>
            <View style={{ flexDirection: "row" }}>
              <Image source={require("@/assets/icons/humidity.png")} style={{ width: 20, height: 20 }} />
              <Text style={styles.detailsText}>{data.main.humidity}%</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Image source={require("@/assets/icons/wind.png")} style={{ width: 20, height: 20 }} />
              <Text style={styles.detailsText}>{data.wind?.speed}°C</Text>
            </View>
            {data.snow &&
              <View style={{ flexDirection: "row" }}>
                <Image source={require("@/assets/icons/snow.png")} style={{ width: 20, height: 20 }} />
                <Text style={styles.detailsText}>{data.snow?.["1h"]} cm</Text>
              </View>
            }
            {data.rain &&
              <View style={{ flexDirection: "row" }}>
                <Image source={require("@/assets/icons/rain.png")} style={{ width: 20, height: 20 }} />
                <Text style={styles.detailsText}>{data.rain?.["1h"]} cm</Text>
              </View>
            }
          </View>
        </View>
      </View>
      <View style={[styles.subContainer, styles.darkPurple]}>
        <Card data={forecast} />
      </View>
    </>

  );
}



