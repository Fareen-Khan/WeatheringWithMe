import { Theme } from "@/styles/Colors";
import { globalStyles } from "@/styles/weatherStyles";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";


interface LocationHeaderProps {
  city: string;
  country: string;
  onRefresh: () => void;
  searchRef?: string;
};

export function LocationHeader({ city, country, onRefresh, searchRef }: LocationHeaderProps) {
  return (
    <View style={styles.locationHeaderContainer}>
      <Link href={"/(home)/search"}>
        <Feather name="search" size={20} color={Theme.colors.white} />
        <Text style={globalStyles.locationText}>
          {city}, {country}
        </Text>
      </Link>
      <Pressable onPress={() => {
        onRefresh()
      }}>
        <Feather name="map-pin" size={20} color={Theme.colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  locationHeaderContainer: { flexDirection: "row", gap: 10, alignItems: "center" }
})