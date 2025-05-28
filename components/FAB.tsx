import { Theme } from "@/styles/Colors"
import Feather from "@expo/vector-icons/Feather"
import React from "react"
import { Pressable, StyleSheet } from "react-native"

type FABPosition = "left" | "center" | "right"

interface FABProps {
  onPress: () => void
  position?: FABPosition
  size?: number
}

export function FAB({ onPress, position = "right", size = 56 }: FABProps) {
  // Decide the horizontal style
  let horizontalStyle: any
  switch (position) {
    case "left":
      horizontalStyle = { left: 16 }
      break
    case "center":
      horizontalStyle = {
        left: "50%",
        marginLeft: -size / 2,
      }
      break
    case "right":
    default:
      horizontalStyle = { right: 16 }
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.fab,
        {
          bottom: 4,
          width: size,
          height: size,
          borderRadius: size / 2,
          ...horizontalStyle,
        },
      ]}
    >
      <Feather name="plus" size={24} color={Theme.colors.white} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    backgroundColor: Theme.colors.gray,
    alignItems: "center",
    justifyContent: "center",

    // Android shadow:
    elevation: 6,

    // iOS shadow:
    shadowColor: Theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
})
