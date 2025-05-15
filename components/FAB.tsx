// components/FAB.tsx
import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Theme } from "@/styles/Colors"

type FABPosition = "left" | "center" | "right"

interface FABProps {
  onPress: () => void
  position?: FABPosition
}

export function FAB({ onPress, position = "right" }: FABProps) {
  const insets = useSafeAreaInsets()

  // Decide the horizontal style
  let horizontalStyle: any
  switch (position) {
    case "left":
      horizontalStyle = { left: 16 }
      break
    case "center":
      horizontalStyle = {
        left: "50%",        // move to center of parent
        marginLeft: -28,    // pull back half the FAB width (56/2)
      }
      break
    case "right":
    default:
      horizontalStyle = { right: 16 }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        horizontalStyle,
        { bottom: insets.bottom + 16 },  // always stay above the home indicator
      ]}
    >
      <Feather name="plus" size={24} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.base.lightFadedA0,
    alignItems: "center",
    justifyContent: "center",
  },
})
