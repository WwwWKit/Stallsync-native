const coffeeTheme = {
  primary: "#8B593E",
  tint: "#C68C6A",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  card: "#FFFFFF",
  shadow: "#000000",
};

const forestTheme = {
  primary: "#2E7D32",
  tint: "#558B2F",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  card: "#FFFFFF",
  shadow: "#000000",
};

const purpleTheme = {
  primary: "#6A1B9A",
  tint: "#BA68C8",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BA68C8",
  card: "#FFFFFF",
  shadow: "#000000",
};

const oceanTheme = {
  primary: "#0277BD",
  tint: "#42A5F5",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  card: "#FFFFFF",
  shadow: "#000000",
};

const sunsetTheme = {
  primary: "#FF7E67",
  tint: "#FFB74D",
  background: "#FFF3F0",
  text: "#2C1810",
  border: "#FFD5CC",
  white: "#FFFFFF",
  textLight: "#FFA494",
  card: "#FFFFFF",
  shadow: "#000000",
};

const mintTheme = {
  primary: "#00B5B5",
  tint: "#00E5FF",
  background: "#E8F6F6",
  text: "#006666",
  border: "#B2E8E8",
  white: "#FFFFFF",
  textLight: "#66D9D9",
  card: "#FFFFFF",
  shadow: "#000000",
};

const midnightTheme = {
  primary: "#2C3E50",
  tint: "#5D6D7E",
  background: "#F4F6F7",
  text: "#1A2530",
  border: "#D5D8DC",
  white: "#FFFFFF",
  textLight: "#7F8C8D",
  card: "#FFFFFF",
  shadow: "#000000",
};

const roseGoldTheme = {
  primary: "#E0BFB8",
  tint: "#F7E7E0",
  background: "#FDF6F5",
  text: "#4A3B38",
  border: "#F2D9D5",
  white: "#FFFFFF",
  textLight: "#C9A9A6",
  card: "#FFFFFF",
  shadow: "#000000",
};

export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  mint: mintTheme,
  midnight: midnightTheme,
  roseGold: roseGoldTheme,
};

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const tintedGold = "#E8D8B5";

// 👇 change this to switch theme
export const ActiveTheme = THEMES.roseGold;

export const Colors = {
  light: {
    primary: "#C2A76D", // gold
    badge: "#0d2014", //black
    text: "#11181C", // black
    background: "#fff", //white
    tint: tintedGold, // light gold
    icon: "#687076", // dark grey
    tabIconDefault: "#687076", // dark grey
    tabIconSelected: tintedGold, // light gold
    border: "#C2A76D", // gold
    textLight: "#11181C", // black
    placeholder: "#4f4f4f", //  grey
    textPlaceholder: "#888", // light grey
    separator: "#e0e0e0", // light grey
    view: "#fff",
    shadowColor: "#000",
    listBackground: "#fff",
    white: "#fff",
    greyBackground: "#f5f5f5",
    bronze: "#cd7f32",
    silver: "#c0c0c0",
    gold: "#ffd700",
  },
  dark: {
    primary: "#C2A76D",
    badge: "#42cf76", // green
    text: "#ECEDEE", // white with grey
    background: "#151718", // black
    tint: tintedGold, // light gold
    icon: "#9BA1A6", // grey
    tabIconDefault: "#9BA1A6", // grey
    tabIconSelected: tintedGold, // light gold
    border: "#C2A76D", // gold
    textLight: "#EBEBEB", // white with grey
    placeholder: "#4f4f4f", // grey
    textPlaceholder: "#888", // light grey
    separator: "#e0e0e0",
    view: "#151718",
    shadowColor: "#fff",
    listBackground: "#1E1F21",
    white: "#fff",
    greyBackground: "#f5f5f5",
    bronze: "#cd7f32",
    silver: "#c0c0c0",
    gold: "#ffd700",
  },
};

// #075985 IOS blue
