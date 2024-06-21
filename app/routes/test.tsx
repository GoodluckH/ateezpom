import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { AnimatePresence, m } from "framer-motion";
import { useContext, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = [
    { id: "1", title: "First", subtitle: "First subtitle" },
    { id: "2", title: "Second", subtitle: "Second subtitle" },
    { id: "3", title: "Third", subtitle: "Third subtitle" },
  ];
  const item = items.find((item) => item.id === selectedId);
  return (
    <>
      {items.map((item) => (
        <m.div layoutId={item.id} onClick={() => setSelectedId(item.id)}>
          <m.h5>{item.subtitle}</m.h5>
          <m.h2>{item.title}</m.h2>
        </m.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <m.div layoutId={selectedId}>
            <m.h5>{item?.subtitle}</m.h5>
            <m.h2>{item?.title}</m.h2>
            <m.button onClick={() => setSelectedId(null)} />
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
