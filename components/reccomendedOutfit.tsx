// src/components/RecommendedOutfit.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "@/styles/Colors";
import type { Outfit } from "@/utils/types";

interface RecommendedOutfitProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
}

export function RecommendedOutfit({
  visible,
  outfit,
  onClose,
}: RecommendedOutfitProps) {
  const { width } = useWindowDimensions();

  // compute dynamic card size so exactly 4 cards fit across
  const SIDE_PADDING = 16;
  const GAP = 12;
  const COUNT = 4;
  const cardWidth = (width - SIDE_PADDING * 2 - GAP * (COUNT - 1)) / COUNT;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <Text style={styles.title}>Your Suggested Outfit</Text>

        <View
          style={[
            styles.cardsRow,
            { paddingHorizontal: SIDE_PADDING },
          ]}
        >
          {(["shirt", "pants", "shoes", "headwear"] as (keyof Outfit)[]).map(
            (slot, i) => {
              const item = outfit?.[slot];
              return (
                <View
                  key={slot}
                  style={[
                    styles.card,
                    {
                      width: cardWidth,
                      marginRight: i < COUNT - 1 ? GAP : 0,
                    },
                  ]}
                >
                  {item ? (
                    <Image
                      source={{ uri: item.imageUri! }}
                      style={[styles.image, { width: cardWidth, height: cardWidth }]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.empty,
                        { width: cardWidth, height: cardWidth },
                      ]}
                    >
                      <Text style={styles.emptyText}>N/A</Text>
                    </View>
                  )}
                  <Text style={styles.label}>
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </Text>
                </View>
              );
            }
          )}
        </View>

        <Pressable onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.modalBackgroundDark,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: 12,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    borderRadius: 8,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.gray,
    borderRadius: 8,
  },
  emptyText: {
    color: Theme.colors.lighterGray,
    textAlign: "center",
  },
  label: {
    marginTop: 6,
    color: Theme.colors.white,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Theme.colors.gray,
    borderRadius: 20,
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: 16,
  },
});
