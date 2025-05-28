import { Theme } from "@/styles/Colors";
import { Feather } from "@expo/vector-icons";
import React, { useState, useRef } from "react"
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native"

interface Tag { label: string; value: string }
interface DropdownProps {
  selected: string[]
  onChange: (newSelected: string[]) => void
  singleSelect?: boolean
  allTags: Tag[]
}

export function Dropdown({
  selected,
  onChange,
  singleSelect = false,
  allTags,
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  // store trigger's on-screen layout
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const triggerRef = useRef<View>(null)

  const handleOpen = () => {
    // measure the trigger's position in the window
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height })
      setOpen(true)
    })
  }

  const pick = (value: string) => {
    if (singleSelect) {
      onChange([value])
    } else {
      onChange(
        selected.includes(value)
          ? selected.filter(v => v !== value)
          : [...selected, value]
      )
    }
    setOpen(false)
  }

  return (
    <View style={{ width: "100%" }}>
      <Pressable
        onPress={handleOpen}
        ref={triggerRef}
        style={[styles.dropdown, {
          borderBottomStartRadius: open ? 0 : 10,
          borderBottomEndRadius: open ? 0 : 10,
        }]}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {selected.length > 0
            ? selected.map(name => (
              <Text
                key={name}
                style={singleSelect ? {} : styles.dropdownText}
              >
                {name}
              </Text>
            ))
            : (
              <Text style={{ paddingHorizontal: 6, paddingVertical: 3 }}>
                {singleSelect ? "Select type of garment" : "Select tags"}
              </Text>
            )}
        </View>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color={Theme.colors.black} />
      </Pressable>

      <Modal visible={open} transparent animationType="none">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setOpen(false)}
        />

        <View
          style={[styles.modalOpen, {
            top: layout.y + layout.height,
            left: layout.x,
            width: layout.width,
          }]}
        >
          {allTags.map(tag => (
            <Pressable
              key={tag.value}
              onPress={() => pick(tag.value)}
              style={{ paddingVertical: 8 }}
            >
              <Text>{tag.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.colors.white,
    shadowColor: Theme.colors.black,
    elevation: 2,
    marginBottom: 8,
  },

  dropdownText: {
    marginRight: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "gray",
    borderRadius: 10,
  },

  modalOpen: {
    position: "absolute",
    backgroundColor: Theme.colors.white,
    padding: 20,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },



})