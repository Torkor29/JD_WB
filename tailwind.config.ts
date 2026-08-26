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
        ink: {
          DEFAULT: "var(--color-ink)",
          soft: "var(--color-ink-soft)",
          mute: "var(--color-ink-mute)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          hover: "var(--color-surface-hover)",
        },
        line: "var(--color-line)",
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
          deep: "var(--color-accent-deep)",
        },
        forest: "var(--color-forest)",
        ivory: "var(--color-ivory)",
        mist: "var(--color-mist)",
        cta: {
          DEFAULT: "var(--color-cta)",
          fg: "var(--color-cta-fg)",
          hover: "var(--color-cta-hover)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.2rem, 9vw, 7.5rem)",
          { lineHeight: "0.92", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(2.4rem, 5.5vw, 4.5rem)",
          { lineHeight: "0.98", letterSpacing: "-0.035em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(1.75rem, 3.2vw, 2.75rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "650" },
        ],
      },
      maxWidth: {
        site: "1180px",
        wide: "1400px",
      },
      transitionTimingFunction: {
        outback: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
