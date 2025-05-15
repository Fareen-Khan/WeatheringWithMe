import React, { useState } from "react"
import { View, Text, Pressable, Modal } from "react-native"

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
    <View style={{ padding: 16, backgroundColor: "white", borderRadius: 8 }}>
      {/* → Just a row of selected items (or empty) + arrow button */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {selected.map(name => (
          <Text key={name} style={singleSelect ? {} : { marginRight: 8, paddingHorizontal:6, paddingVertical:3, backgroundColor: "gray", borderRadius: 10}}>{name}</Text> 
        ))}
        <Pressable onPress={() => setOpen(true)}>
          <Text>▼</Text>
        </Pressable>
      </View>

      {/* → The modal picker */}
      <Modal visible={open} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => setOpen(false)}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
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
        </Pressable>
      </Modal>
    </View>
  )
}
