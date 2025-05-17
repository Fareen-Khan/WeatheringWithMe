import React, { useState, useEffect, use } from "react";
import { ImageBackground, Button, Image, View, Text, TextInput, Pressable } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import * as ImagePicker from "expo-image-picker";
import { Theme } from "@/styles/Colors";
import { Dropdown } from "@/components/dropdown";

import { addClothingItem, deleteClothingItem, getAllClothingItems, addItemTag, getTagsForItems, getItemsForTag, getAllTags } from "@/utils/db";
import { ClothingItem } from "@/utils/types";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function Outfits() {
  const [image, setImage] = useState<string | null>(null);
  const [clothingType, setClothingType] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const possibleClothingTypes = [
    { label: "Shirt", value: "Shirt" },
    { label: "Shoe", value: "Shoe" },
    { label: "Pants", value: "Pants" },
    { label: "Headwear", value: "Headwear" },
  ]

  // Each represnets a temp range
  const possibleTags = [
    { label: "Summer", value: "Summer" }, // temp > 22
    { label: "Winter", value: "Winter" }, // temp < 8
    { label: "Spring", value: "Spring" }, // temp < 22
    { label: "Fall", value: "Fall" }, //temp < 15
  ]

  // logic to open the image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const addClothingItemToDb = async () => {
    const item: ClothingItem = {
      type: clothingType[0],
      imageUri: image,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const clothingId = await addClothingItem(item);
    // Add tags to the item
    tags.map(async (tag) => {
      const tagId = await addItemTag(clothingId, tag);
    })

    router.back();

  }

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]} >
      <ImageBackground
        source={require("@/assets/images/night_time.png")}
        style={[styles.bgImage, { flex: 1 }]}
        resizeMode="cover"
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <Pressable
            onPress={pickImage}
            style={{
              width: "100%",
              aspectRatio: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#fff",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {image
              ? <Image source={{ uri: image }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
              : (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Feather name="camera" size={48} color="#fff" />
                  <Text style={{ color: "#fff", marginTop: 8, fontSize: 16 }}>
                    Tap to select photo
                  </Text>
                </View>
              )
            }
          </Pressable>
          {/* Type of clothing */}

          <Dropdown
            selected={clothingType}
            onChange={setClothingType}
            allTags={possibleClothingTypes}
            singleSelect={true}
          />
          {/* Tags */}
          <Dropdown
            selected={tags}
            onChange={setTags}
            allTags={possibleTags}
          />


          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 16,
            }}
          >
            {/* Cancel */}
            <Pressable
              onPress={() => router.back()}
              style={{
                flex: 1,
                marginRight: 8,
                paddingVertical: 12,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: Theme.primary.a0,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Theme.primary.a0, fontSize: 16, fontWeight: "600" }}>
                Cancel
              </Text>
            </Pressable>

            {/* Add */}
            <Pressable
              onPress={addClothingItemToDb}
              style={{
                flex: 1,
                marginLeft: 8,
                paddingVertical: 12,
                borderRadius: 24,
                backgroundColor: Theme.primary.a0,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Add
              </Text>
            </Pressable>
          </View>
        </View>


      </ImageBackground>

    </View>

  );
}