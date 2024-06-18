import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { useEffect, useState } from "react";
import { SupportedThemes } from "./types/theme";
import { ThemeContext } from "./context/ThemeContext";
import { themeChange } from "theme-change";
import { NavBar } from "./components/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SupportedThemes | undefined>(
    SupportedThemes.LIGHT
  );

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <html lang="en" data-theme={theme}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <NavBar />
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return <Outlet />;
}
