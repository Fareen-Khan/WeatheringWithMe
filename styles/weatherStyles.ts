import { StyleSheet, Dimensions } from "react-native"
import { Theme } from "@/constants/Colors"

const { height } = Dimensions.get("window")
export const weatherStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	bgImage: {
		flex: 1,
		justifyContent: "center",
	},
	subContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},

	topContainer: {
		flex: 2,
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 20,
	},

	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		top: height * 0.7,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: Theme.primary.a0,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
	},

	icon: {
		width: 120,
		height: 120,
		alignSelf: "center",
		marginBottom: -20,
		backgroundColor: "transparent",
		color: "white",
	},

	locationText: {
		fontSize: 20,
		fontWeight: "bold",
		color: Theme.base.lightA0,
		opacity: 0.8,
	},
	tempText: {
		fontSize: 24,
		fontWeight: "bold",
		color: Theme.base.lightA0,
		marginTop: 5,
		elevation: 5,
	},
	detailsText: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		color: Theme.base.lightA0,
	},
	subDetailsText: {
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "center",
		color: Theme.base.lightA0,
		opacity: 0.8,
	},

	forecastContainer: {
		flexDirection: "row",
		width: "100%",
		paddingVertical: 10,
	},
	weatherInfo: {
		alignItems: "center",
		gap: 5,
	},

	pillBox: {
		flexDirection: "row",
		gap: 10,
		// backgroundColor: Theme.tonal.a20,
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 5,
		elevation: 2,
		overflow: "hidden",
	},

	cardContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingHorizontal: 10,
	},
	cardSubContainer: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "transparent",
    borderRadius: 10,
		paddingVertical: 8,
    alignItems: "center",
    width:100
	},
})
