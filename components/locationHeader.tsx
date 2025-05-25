import { Theme } from "@/styles/Colors";
import { globalStyles } from "@/styles/weatherStyles";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";


interface LocationHeaderProps {
  city: string;
  country: string;
  onRefresh: () => void;
  searchRef?: string;
};

export function LocationHeader({ city, country, onRefresh, searchRef }: LocationHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.locationHeaderContainer}>
      <Pressable
        onPress={() => {
          router.push("/(home)/search")
        }}
        style={styles.searchButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="search" size={20} color={Theme.colors.white} />
        <Text style={globalStyles.locationText}>
          {city}, {country}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          onRefresh()
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}

      >
        <Feather name="map-pin" size={20} color={Theme.colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  locationHeaderContainer: { flexDirection: "row", gap: 10, alignItems: "center" },
  searchButton: { flexDirection: "row", alignItems: "center" },
})