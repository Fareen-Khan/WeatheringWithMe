import { weatherStyles as styles } from "@/styles/weatherStyles";
import { Text, Image } from "react-native";

interface WeatherSummaryProps { 
  feelsLike: number;
  temp: number;
  icon: string;
  unit: string;

}

export function WeatherSummary({ feelsLike, temp, icon, unit }: WeatherSummaryProps) {
  return (
    <>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${icon}@4x.png`,
        }}
        style={styles.icon}
      />
      <Text style={styles.tempText}>{Math.round(feelsLike)}{ unit}</Text>
      <Text style={styles.detailsText}>
        Actual: {Math.round(temp)}{ unit}
      </Text>
    </>
  );
}