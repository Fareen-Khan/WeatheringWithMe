import { FAB } from "@/components/FAB";
import { Theme } from "@/styles/Colors";
import { globalStyles } from "@/styles/weatherStyles";
import { deleteClothingItem, getAllClothingItems, getTagsForItems } from "@/utils/db";
import { ClothingItem } from "@/utils/types";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <ImageBackground
      source={require("@/assets/images/night_time.png")}
      style={globalStyles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeAreaView}
        edges={["top"]}>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {
            allClothingItems.map((item) => (
              <View
                key={item.id}
                style={styles.clothingItem}>
                <Image
                  source={{ uri: item.imageUri ?? "https://picsum.photos/200/300" }}
                  style={styles.clothingItemImage}
                />
                <Pressable
                  onPress={() => {
                    setMenuOpenId((prev) =>
                      prev === item.id ? null : item.id!
                    )
                  }}
                  style={styles.clothingItemMenu}
                >
                  <Feather name="more-horizontal" size={24} color={Theme.colors.white} />
                </Pressable>
                {menuOpenId === item.id && (
                  <View
                    style={styles.clothingItemMenuText}
                  >
                    <Pressable
                      onPress={() => handleDelete(item.id!)}
                      style={styles.deleteButton}
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

      <FAB onPress={() => router.push("/outfits/addOutfit")} position="center" size={64} />


    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollViewContent: {
    flexDirection: "row", flexWrap: "wrap", padding: 20, justifyContent: "space-between",

    // iOS shadow:
    shadowColor: Theme.colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  clothingItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    // Android shadow:
    elevation: 10,
  },

  clothingItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },

  clothingItemMenu: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Theme.colors.black70,
    borderRadius: 12,
    padding: 4,
  },

  clothingItemMenuText: {
    position: "absolute",
    top: 36,
    right: 8,
    backgroundColor: Theme.colors.black,
    borderRadius: 6,
    elevation: 4,
    shadowColor: Theme.colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },

  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  }
})