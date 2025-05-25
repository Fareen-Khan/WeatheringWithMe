import { Theme } from "@/styles/Colors";
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.white,
        tabBarInactiveTintColor: Theme.colors.lightGray,
        tabBarStyle: {
          backgroundColor: Theme.colors.black,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}

    >
      <Tabs.Screen name="(home)" options={{
        tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        title: "Home",
        popToTopOnBlur: true,
      }} />

      <Tabs.Screen name="outfits" options={{
        tabBarIcon: ({ color }) => <Feather name="tag" size={20} color={color} />,
        title: "Wardrobe",
        popToTopOnBlur: true,

      }} />
    </Tabs>
  )
}
