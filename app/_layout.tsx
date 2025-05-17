import { Theme } from "@/styles/Colors";
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Theme.base.lightA0,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
      tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,      
        elevation: 0,          
        position: "absolute",
        },
    }}
    
    >
      <Tabs.Screen name="(home)" options={{
        tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        title: "Home"
      }} />

      <Tabs.Screen name="outfits" options={{
        tabBarIcon: ({ color }) => <Feather name="tag" size={20} color={color} />,
        title: "Outfits"
      }} />
    </Tabs>
  )
}
