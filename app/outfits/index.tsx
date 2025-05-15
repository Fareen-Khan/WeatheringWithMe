import React, { useState, useEffect } from "react";
import { ImageBackground, Button, Image, View, Text, SafeAreaView } from "react-native";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { addClothingItem, deleteClothingItem, getAllClothingItems, addItemTag, getTagsForItems, getItemsForTag, getAllTags } from "@/utils/db";
import { ClothingItem } from "@/utils/db";

export default function Outfits() {
  const [allClothingItems, setAllClothingItems] = useState<ClothingItem[]>([]);


  const testGetAll = async () => { 
    const items = await getAllClothingItems();
    console.log("items:", items);
    setAllClothingItems(items);
  }
  const getAllTags = async (id:number) => { 
    const tags = await getTagsForItems(id);
    return tags.map((tag) => tag).join(", ");
  }

  useEffect(() => {
    testGetAll();
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "transparent" }]} >
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

          {/* Add a new clothing item */}
          <Link href={"/outfits/addOutfit"}>
            <Feather name="plus-square" size={20} color="white" />
          </Link>
          {
            allClothingItems.map((item, index) => {
              // console.log("item:", item);
              // console.log("item.imageUri:", item.imageUri);
              
              return (
                
                  <View key={index} style={styles.cardSubContainer}>
                    <Image
                      source={{ uri: item.imageUri ?? "https://picsum.photos/200/300" }}
                      style={{ width: 200, height: 200 }}
                  />
                    {/* Tags */}
                    <Text>
                      {getAllTags(item.id ?? 1)}
                    </Text>
                  </View>
                

              )
            })
          }
        </View>


      </ImageBackground>

    </SafeAreaView>

  );
}