import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-once": "ping-once 0.5s cubic-bezier(0, 0, 0.2, 1.2) forwards",
      },
      keyframes: {
        "ping-once": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "75%": {
            transform: "scale(1.1)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1.1)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      {
        ateez: {
          "base-100": "#264557",
          primary: "#EDE483",
          "base-content": "#EDE483",
        },
      },
    ],
  },
} satisfies Config;
