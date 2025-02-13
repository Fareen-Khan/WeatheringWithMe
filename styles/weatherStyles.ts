import { StyleSheet } from "react-native";

export const weatherStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensures it takes the full width
  },
  lightPurple: {
    flex: 2,
    backgroundColor: "#D8DAFF",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start", // Aligns everything to the top
    paddingVertical: 20, // Reduce overall padding
  },
  darkPurple: {
    flex: 1,
    backgroundColor: "#AAB7FD",
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    zIndex: -1,
  },
  icon: {
    width: 120, // Adjust as needed
    height: 120,
    alignSelf: "center",
    marginBottom: -20, // Adjust as needed
    backgroundColor: "transparent", // Remove background color
  },
  locationText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A228F",
    opacity: 0.7,
  },
  tempText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A228F",
    marginTop: 5, // Add small spacing
    elevation: 5, // Add elevation for shadow
  },
  detailsText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2A228F",
  },
  forecastContainer: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
  },
  weatherInfo: {
    alignItems: "center", // Ensures text stays centered
    gap: 5,
  },
  pillBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#AAB7FD",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 5,
  }
});
