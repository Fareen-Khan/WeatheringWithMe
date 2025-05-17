import { weatherStyles as styles } from "@/styles/weatherStyles";
import { BlurView } from "expo-blur";
import { WeatherSymbol } from "@/components/weatherSymbol";
import { Feather } from "@expo/vector-icons";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

export interface PillItem { 
  value: number;
  unit: string;
  symbol: FeatherName;
}

interface WeatherPillBoxProps { 
  items: PillItem[];
}

export function WeatherPillBox({ items }: WeatherPillBoxProps) { 

  return (
    <>
      <BlurView style={styles.pillBox}>
        {items.map((item, index) => (
          <WeatherSymbol
            key={index}
            data={item.value}
            symbol={item.symbol}
            unit={item.unit}
          />
        ))}
      </BlurView>
    </>
  )
}