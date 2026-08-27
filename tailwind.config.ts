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
        paper: {
          DEFAULT: "var(--color-paper)",
          soft: "var(--color-paper-soft)",
          mute: "var(--color-paper-mute)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          soft: "var(--color-ink-soft)",
        },
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
          deep: "var(--color-accent-deep)",
          mist: "var(--color-accent-mist)",
        },
        cta: {
          DEFAULT: "var(--color-cta)",
          fg: "var(--color-cta-fg)",
          hover: "var(--color-cta-hover)",
        },
        // legacy aliases mapped for gradual migration
        surface: {
          DEFAULT: "var(--color-paper)",
          raised: "var(--color-paper-soft)",
          hover: "var(--color-paper-mute)",
        },
        ivory: "var(--color-ink)",
        mist: "var(--color-muted)",
        forest: "var(--color-accent-deep)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.35rem, 8.5vw, 6.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.045em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(1.85rem, 5vw, 4.25rem)",
          { lineHeight: "1.06", letterSpacing: "-0.035em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(1.45rem, 3vw, 2.6rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "650" },
        ],
      },
      maxWidth: {
        site: "1180px",
        wide: "1400px",
      },
      transitionTimingFunction: {
        outback: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 40, 90, 0.08)",
        lift: "0 28px 60px rgba(31, 94, 255, 0.16)",
        card: "0 12px 40px rgba(11, 31, 58, 0.08)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6.5s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
