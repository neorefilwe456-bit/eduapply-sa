import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          foreground: "#1A1A1A",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "elevate-sm": "0 2px 8px -2px rgba(37,99,235,0.12), 0 1px 2px rgba(15,23,42,0.06)",
        "elevate-md": "0 10px 28px -6px rgba(37,99,235,0.18), 0 3px 8px rgba(15,23,42,0.08)",
        "elevate-lg": "0 20px 48px -10px rgba(37,99,235,0.24), 0 6px 16px rgba(15,23,42,0.1)",
        "btn-3d": "0 4px 0 0 rgba(29,78,216,1)",
        "btn-3d-secondary": "0 4px 0 0 rgba(4,120,87,1)",
        "btn-3d-outline": "0 4px 0 0 rgba(148,163,184,0.6)",
      },
      transitionProperty: {
        depth: "transform, box-shadow",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;