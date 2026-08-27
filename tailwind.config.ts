import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B1F3A",
          soft: "#16325A",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FA",
          mute: "#EEF1F5",
        },
        ink: {
          DEFAULT: "#0B1F3A",
          soft: "#243B55",
        },
        muted: "#5B6B80",
        line: "rgba(11, 31, 58, 0.1)",
        accent: {
          DEFAULT: "#1F5EFF",
          soft: "#E8F0FF",
          deep: "#0A3FCC",
          mist: "#C9DAFF",
        },
        cta: {
          DEFAULT: "#0B1F3A",
          fg: "#FFFFFF",
          hover: "#16325A",
        },
        sand: {
          DEFAULT: "#D9C4A5",
          soft: "#F3EDE4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Almarai", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Instrument Serif", "serif"],
        display: ["var(--font-display)", "Syne", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        outback: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(11, 31, 58, 0.08)",
        lift: "0 24px 50px rgba(31, 94, 255, 0.14)",
        card: "0 12px 36px rgba(11, 31, 58, 0.07)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        kenburns: "kenburns 20s ease-in-out infinite alternate",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
