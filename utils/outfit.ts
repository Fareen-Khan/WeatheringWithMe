interface OutfitRange {
	minTemp: number
	maxTemp: number
	images: string[] // or require() references if using local assets
}


const outfitRanges: OutfitRange[] = [
  {
    minTemp: -100,
    maxTemp: -15,
    images: [
      require("@/assets/images/outfits/1-2.png"),
    ],
  },
  {
    minTemp: -14,
    maxTemp: -10,
    images: [
      require("@/assets/images/outfits/15.png"),
      require("@/assets/images/outfits/16.png"),
    ],
  },
  {
    minTemp: -9,
    maxTemp: -5,
    images: [
      require("@/assets/images/outfits/9.png"),
      require("@/assets/images/outfits/10.png"),
      require("@/assets/images/outfits/14.png"),
    ],
  },
  {
    minTemp: -4,
    maxTemp: 5,
    images: [
      require("@/assets/images/outfits/3.png"),
      require("@/assets/images/outfits/5.png"),
      require("@/assets/images/outfits/11.png"),
      require("@/assets/images/outfits/12.png"),
      require("@/assets/images/outfits/13.png"),
    ],
  },
  {
    minTemp: 4,
    maxTemp: 15,
    images: [
      require("@/assets/images/outfits/4.png"),
      require("@/assets/images/outfits/8.png"),
    ],
  },
  {
    minTemp: 14,
    maxTemp: 100,
    images: [
      require("@/assets/images/outfits/6.png"),
      require("@/assets/images/outfits/7.png"),
    ],
  },
];

export function getRandomOutfit(temp: number) {
  const range = outfitRanges.find((range) => temp >= range.minTemp && temp <= range.maxTemp);
  if (!range) {
    return null;
  }
  const { images } = range;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}