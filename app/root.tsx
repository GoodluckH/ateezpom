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
import { NavBarContext } from "./context/NavBarContext";
import { PiPProvider } from "./PiP/PiPProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SupportedThemes | undefined>(
    SupportedThemes.ATEEZ
  );
  const [showAlbumCard, setShowAlbumCard] = useState(false);

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <NavBarContext.Provider value={{ showAlbumCard, setShowAlbumCard }}>
        <html lang="en" data-theme={theme}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
          </head>
          <body>
            <PiPProvider>
              <NavBar />
              {children}
            </PiPProvider>
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </NavBarContext.Provider>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return <Outlet />;
}
