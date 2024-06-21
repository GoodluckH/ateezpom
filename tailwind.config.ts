import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|dropdown|image|input|popover|ripple|spinner|menu|divider).js",
  ],
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
      "dark",
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
