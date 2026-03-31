import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E8E4DE",
        background: "#FAF8F5",
        foreground: "#1C1C1E",
        accent: {
          DEFAULT: "#C8963E",
          hover: "#A67B2E",
          light: "rgba(200, 150, 62, 0.12)",
        },
        success: "#4A7C59",
        error: "#C25450",
        secondary: {
          DEFAULT: "#6B6B6B",
          foreground: "#1C1C1E",
        },
        muted: {
          DEFAULT: "#6B6B6B",
          foreground: "#6B6B6B",
        },
        primary: {
          DEFAULT: "#1C1C1E",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C1C1E",
        },
        gold: {
          DEFAULT: "#C8963E",
          light: "#E8B86D",
          dark: "#A67B2E",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontFamily: {
        // Premium: Cormorant Garamond for dramatic editorial headings
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        // Modern with character for body
        sans: ["'Instrument Sans'", "system-ui", "sans-serif"],
        // Mono for technical elements
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(28, 28, 30, 0.06)",
        md: "0 4px 12px rgba(28, 28, 30, 0.08)",
        lg: "0 12px 32px rgba(28, 28, 30, 0.12)",
        xl: "0 24px 64px rgba(28, 28, 30, 0.16)",
        "2xl": "0 32px 80px rgba(28, 28, 30, 0.20)",
        glow: "0 0 24px rgba(200, 150, 62, 0.25)",
        "glow-lg": "0 0 48px rgba(200, 150, 62, 0.30)",
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "breathe": "breathe 2.5s ease-in-out infinite",
        "scale-in": "scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-left": "slide-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-right": "slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer-slide": "shimmer-slide 1.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
