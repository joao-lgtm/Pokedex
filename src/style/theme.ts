const shared = {
    shell: "#d4102a",
    shellDark: "#8f0618",
    shellLight: "#ff4d5e",
    bezel: "#e9e4dc",
    lens: "#2aa8ff",
    lensDeep: "#0a4fb3",
    fontUi: `"Rubik", system-ui, sans-serif`,
    fontPixel: `"Pixelify Sans", "Rubik", monospace`,
};

export const darkTheme = {
    ...shared,
    name: "dark" as const,
    background: "#0b0a10",
    backgroundGlow: "rgba(212, 16, 42, 0.18)",
    font: "#f2f4f8",
    fontMuted: "#8f97ab",
    screen: "#0f1626",
    screenAlt: "#17213a",
    screenLine: "rgba(255, 255, 255, 0.06)",
    card: "#16203a",
    cardHover: "#1d2a4b",
};

export const lightTheme = {
    ...shared,
    name: "light" as const,
    background: "#efe9e2",
    backgroundGlow: "rgba(42, 168, 255, 0.22)",
    font: "#14161c",
    fontMuted: "#5d6474",
    screen: "#dfeee4",
    screenAlt: "#cfe3d6",
    screenLine: "rgba(0, 40, 20, 0.07)",
    card: "#f6fbf7",
    cardHover: "#ffffff",
};

export type AppTheme = typeof darkTheme | typeof lightTheme;
