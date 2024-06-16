import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { SupportedThemes } from "~/types/theme";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export const loader: LoaderFunction = () => {
  return Math.random().toFixed(2);
};

export const action: ActionFunction = () => {
  console.log("hahah");
  return 300;
};

export default function Index() {
  const data = useLoaderData() as String;
  const { setTheme } = useContext(ThemeContext);
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">{data}</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        {Object.keys(SupportedThemes).map((themeKey, idx) => {
          const theme =
            SupportedThemes[themeKey as keyof typeof SupportedThemes];
          return (
            <li
              key={idx}
              onClick={() => {
                setTheme(theme);
              }}
            >
              {theme}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
