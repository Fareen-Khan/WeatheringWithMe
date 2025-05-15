// components/FAB.tsx
import React from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { Theme } from "@/styles/Colors"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

type FABPosition = "left" | "center" | "right"

interface FABProps {
  onPress: () => void
  position?: FABPosition
  size?: number
}

export function FAB({ onPress, position = "right", size = 56 }: FABProps) {
  const tabBarHeight = useBottomTabBarHeight()
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
        {
          bottom: tabBarHeight,
          width: size,
          height: size,
          borderRadius: size / 2,
          ...horizontalStyle,
         },
      ]}
    >
      <Feather name="plus" size={24} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    backgroundColor: Theme.base.lightFadedA0,
    alignItems: "center",
    justifyContent: "center",
  },
})
