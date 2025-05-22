import React from "react"
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from "react-native"
import { Outfit } from "@/utils/types"
import { SafeAreaView } from "react-native-safe-area-context"
import { Theme } from "@/styles/Colors"

interface RecommendedOutfitProps {
  visible: boolean
  outfit: Outfit | null
  onClose: () => void
}

export function RecommendedOutfit({
  visible,
  outfit,
  onClose,
}: RecommendedOutfitProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Theme.colors.modalBackgroundDark, 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 16,
        }}
        edges={["bottom"]}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Your Suggested Outfit
        </Text>

        <ScrollView
          horizontal
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsHorizontalScrollIndicator={false}
        >
          {(["shirt", "pants", "shoes", "headwear"] as (keyof Outfit)[]).map(
            (slot) => {
              const item = outfit?.[slot]
              return (
                <View
                  key={slot}
                  style={{
                    width: 100,
                    height: 120,
                    marginRight: 12,
                    alignItems: "center",
                  }}
                >
                  {item ? (
                    <Image
                      source={{ uri: item.imageUri! }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        width: 100,
                        height: 100,
                        textAlign: "center",
                        textAlignVertical: "center",
                        backgroundColor: Theme.colors.lightGray,
                        borderRadius: 8,
                        color: Theme.colors.black70,
                      }}
                    >
                      No {slot} yet
                    </Text>
                  )}
                  <Text style={{ marginTop: 4, fontSize: 14, color: Theme.colors.lightGray}}>
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </Text>
                </View>
              )
            }
          )}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={{
            marginTop: 16,
            alignSelf: "center",
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: Theme.colors.lightGray,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>Close</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  )
}
