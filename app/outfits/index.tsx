import React, { useState, useCallback } from "react";
import { ImageBackground, Image, View, ScrollView } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "@/components/FAB";


import { getAllClothingItems, getTagsForItems } from "@/utils/db";
import { ClothingItem } from "@/utils/db";

export default function Outfits() {
  const [allClothingItems, setAllClothingItems] = useState<ClothingItem[]>([]);
  const [tagsMap, setTagsMap] = useState<Record<number, string>>({});
  const router = useRouter();

  async function loadAll() {
    const fetchedItems = await getAllClothingItems();
    setAllClothingItems(fetchedItems);

    const entries = await Promise.all(fetchedItems.map(async (item) => {
      const tags = await getTagsForItems(item.id!)
      return [item.id!, tags.join(", ")]
    }))
    setTagsMap(Object.fromEntries(entries))
  }

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <ImageBackground
        source={require("@/assets/images/night_time.png")}
        style={[styles.bgImage, { flex: 1 }]}
        resizeMode="cover"
      >
        <SafeAreaView style={{
          flex: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
          edges={["top", "bottom"]}>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: 20, justifyContent: "space-between" }}
          >
            {
              allClothingItems.map((item) => (
                <View key={item.id} style={{
                  width: "48%",
                  aspectRatio: 1,
                  marginBottom: 20,
                  borderRadius: 10,
                  overflow: "hidden",

                }}>
                  <Image
                    source={{ uri: item.imageUri ?? "https://picsum.photos/200/300" }}
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                  />
                </View>
              ))
            }
          </ScrollView>

        </SafeAreaView>

        <FAB onPress={() => router.push("/outfits/addOutfit")} position="center" />

      </ImageBackground>

    </View>

  );
}