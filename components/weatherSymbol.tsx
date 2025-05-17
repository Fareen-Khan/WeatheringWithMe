import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { Feather } from "@expo/vector-icons";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface WeatherSymbolProps {
  symbol: FeatherName;
  data: number;
  unit: string;
}

export function WeatherSymbol ({ symbol, data, unit }: WeatherSymbolProps) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Feather name={symbol} size={20} color="white" />
      <Text style={styles.detailsText}>{data}{ unit}</Text>
    </View>
  );
};