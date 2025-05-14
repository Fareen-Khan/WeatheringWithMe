import { Stack, Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import {Theme} from "@/styles/Colors";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Theme.base.lightA0,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
      tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,      // remove the default border
        elevation: 0,          // remove Android shadow
        position: "absolute",  // float it on top of your screen
        },
    }}
    
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        title: "Home"
      }} />
      <Tabs.Screen name="search" options={{
        href: null,
        title: "Search",
        tabBarStyle: {
          display: "none",
        },
      }} />
      <Tabs.Screen name="outfits" options={{
        tabBarIcon: ({ color }) => <Feather name="tag" size={20} color={color} />,
        title: "Outfits"
      }} />
    </Tabs>
  )
}
