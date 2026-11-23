import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { teal: { 50: "#edf8f6", 100: "#d4efea", 700: "#087568", 800: "#075d55", 900: "#104a44" }, ink: "#18302e", mist: "#f4f7f6" }, fontFamily: { sans: ["Lexend", "sans-serif"], display: ["Epilogue", "sans-serif"] } } }, plugins: [] };
export default config;
