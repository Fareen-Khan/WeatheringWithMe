import React, { useState, useCallback } from "react";
import { ImageBackground, Image, View, ScrollView, Pressable, Text, Alert } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "@/components/FAB";
import { Feather } from "@expo/vector-icons";


import { getAllClothingItems, getTagsForItems, deleteClothingItem } from "@/utils/db";
import { ClothingItem } from "@/utils/db";

export default function Outfits() {
  const [allClothingItems, setAllClothingItems] = useState<ClothingItem[]>([]);
  const [tagsMap, setTagsMap] = useState<Record<number, string>>({});
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
  
  
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

  const handleDelete = async (itemId: number) => {
    Alert.alert(
      "Delete item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteClothingItem(itemId)
            setMenuOpenId(null)
            loadAll()
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    )
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
                  <Pressable
                    onPress={() => {
                      setMenuOpenId((prev) =>
                        prev === item.id ? null : item.id!
                      )
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 12,
                      padding: 4,
                    }}
                  >
                    <Feather name="more-horizontal" size={24} color="white" />
                  </Pressable>
                  {menuOpenId === item.id && (
                    <View
                      style={{
                        position: "absolute",
                        top: 36,
                        right: 8,
                        backgroundColor: "#fff",
                        borderRadius: 6,
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 1 },
                        shadowRadius: 2,
                      }}
                    >
                      <Pressable
                        onPress={() => handleDelete(item.id!)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text style={{ color: "red", fontWeight: "500" }}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  )}
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