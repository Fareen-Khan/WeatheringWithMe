import { weatherStyles as styles } from "@/styles/weatherStyles";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";


interface LocationHeaderProps {
  city: string;
  country: string;
  onRefresh: () => void;
  searchRef?: string;
};

export function LocationHeader({ city, country, onRefresh, searchRef }: LocationHeaderProps) {
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Link href={"/(home)/search"}>
        <Feather name="search" size={20} color="white" />
        <Text style={styles.locationText}>
          {city}, {country}
        </Text>
      </Link>
      <Pressable onPress={() => {
        onRefresh()
      }}>
        <Feather name="map-pin" size={20} color="white" />
      </Pressable>
    </View>
  );
}