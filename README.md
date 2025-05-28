# Weathering With Me 🌤️👗

A React Native mobile app that suggests outfits based on current weather conditions. Weathering With Me combines real-time weather data with a flexible rule engine to recommend appropriate clothing and accessories—helping users dress confidently for any forecast.

---

## 🎥 Quick Demo

![App Demo](https://i.imgur.com/ePOsN8m.gif)

---

## 🚀 Features

- **Real-Time Weather Fetching**: Uses OpenWeatherMap API (or your preferred provider) to get current temperature, conditions, wind speed, and precipitation  
- **Smart Outfit Engine**: Maps weather metrics to garment categories (e.g., shells, sweaters, jackets)
- **Geolocation & Manual Input**: Automatically detects your location or lets you search by city name

---

## 🎬 Screenshots

#### Home / Weather view  
![Current Weather](https://i.imgur.com/5PGypuA.jpeg)

#### Suggested Outfit  
![Outfit Suggestion](https://i.imgur.com/p3iHfKi.jpeg)

#### Location Search  
![Location Search](https://i.imgur.com/7pF7RnY.jpeg)

#### Wardrobe view
![Wardrobe](https://i.imgur.com/J7MfRXl.jpeg)

#### Add Clothing Item  
![Add Clothing Item](https://i.imgur.com/mr0kdk9.jpeg)

---

## 🎬 Usage

- Open the app on your device or emulator
- Allow location permissions or enter a city name
- View the current weather and recommended outfit

---

## 🔍 How It Works

1. Fetch: Retrieves weather data from OpenWeatherMap
2. Evaluate: The outfit engine applies rules
3. Display: Renders a styled outfit card with images

---

## 📦 Installation

```bash
git clone https://github.com/Fareen-Khan/WeatheringWithMe.git
cd weathering-with-me
npm install
expo start        # then scan QR in Expo Go
```