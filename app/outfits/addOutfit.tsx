import { Dropdown } from "@/components/dropdown";
import { Theme } from "@/styles/Colors";
import { globalStyles } from "@/styles/weatherStyles";
import React from "react";
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

import useClothingForm from "@/hooks/useClothingForm";
import { possibleClothingTypes, possibleTags } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Outfits() {
  const { image, clothingType, tags, pickImage, setClothingType, setTags, addClothingItemToDb } = useClothingForm()


  return (
    <ImageBackground
      source={require("@/assets/images/night_time.png")}
      style={globalStyles.bgImage}
      resizeMode="cover"
    >
      <View style={[globalStyles.container, styles.innerView]} >
        <Pressable
          onPress={pickImage}
          style={styles.imagePicker}
        >
          {image
            ? <Image source={{ uri: image }} style={styles.fullImage} />
            : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={48} color={Theme.colors.white} />
                <Text style={styles.placeholderText}>
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
          style={styles.buttonContainer}
        >
          {/* Cancel */}
          <Pressable
            onPress={() => router.back()}
            style={styles.button}
          >
            <Text style={[styles.buttonText, {color: Theme.colors.gray}]}>
              Cancel
            </Text>
          </Pressable>

          {/* Add */}
          <Pressable
            onPress={addClothingItemToDb}
            style={[styles.button, {backgroundColor: Theme.colors.gray}]}
          >
            <Text style={styles.buttonText}>
              Add
            </Text>
          </Pressable>
        </View>



      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  imagePicker: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Theme.colors.black20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Theme.colors.white,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  fullImage: { width: "100%", height: "100%", resizeMode: "cover" },

  imagePlaceholder: { justifyContent: "center", alignItems: "center" },

  placeholderText: { color: Theme.colors.white, marginTop: 8, fontSize: 16 },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 16,
  },

  button: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Theme.colors.gray,
    alignItems: "center",
  },

  buttonText: { color: Theme.colors.white, fontSize: 16, fontWeight: "600" }
})