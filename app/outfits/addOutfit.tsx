import React, { useState, useEffect, use } from "react";
import { ImageBackground, Button, Image, View, Text, TextInput } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import * as ImagePicker from "expo-image-picker";
import { Theme } from "@/styles/Colors";
import { Dropdown } from "@/components/dropdown";

import { addClothingItem, deleteClothingItem, getAllClothingItems, addItemTag, getTagsForItems, getItemsForTag, getAllTags } from "@/utils/db";
import { ClothingItem } from "@/utils/db";

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
  const possibleTags = [
    { label: "Warm", value: "Warm" },
    { label: "Cool", value: "Cool" },
    { label: "Cold", value: "Cold" },
    { label: "Hot", value: "Hot" },
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

  const testGetAll = async () => {
    const items = await getAllClothingItems();
    console.log("All Outfits:", items);
  }

  const addClothingItemToDb = async () => {
    const item: ClothingItem = {
      type: clothingType[0],
      imageUri: image,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const clothingId = await addClothingItem(item);
    console.log("Added item:", item);
    console.log("Added clothingId:", clothingId);

    // Add tags to the item
    tags.map(async (tag) => {
      const tagId = await addItemTag(clothingId, tag);
      console.log("Added tagId:", tagId);
    })

    testGetAll();
  }

  useEffect(() => {
    console.log("clothingType:", clothingType[0])
    console.log("tags:", tags)
  }, [clothingType, tags])


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
        }}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

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
          // singleSelect={true}
          />
          {/* Submit button */}
          <Button
            title="Submit"
            // add to db
            onPress={addClothingItemToDb}
          />
          <Button
            onPress={testGetAll}
            title="get All outfits"
          />
        </View>


      </ImageBackground>

    </View>

  );
}