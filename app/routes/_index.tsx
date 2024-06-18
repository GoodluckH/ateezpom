import type { MetaFunction } from "@remix-run/cloudflare";
import { useRef, useState } from "react";

import { SubmitFunction, useSubmit } from "react-router-dom";
import { motion } from "framer-motion";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "~/utils/styling";
import { useSpring, animated } from "react-spring";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  const [mockData, setMockData] = useState<string[]>([]);
  const submit = useSubmit();

  return (
    <div className="w-full relative h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl gap-3 flex flex-col px-2">
        {mockData.length === 0 && <LaunchCard />}

        {mockData.map((data, idx) => (
          <TaskRow
            task={data}
            key={idx}
            idx={idx}
            submit={submit}
            mockData={mockData}
            setMockData={setMockData}
          />
        ))}
        <button
          type="button"
          className="btn btn-primary w-full rounded-none"
          onClick={() => {
            setMockData([...mockData, ""]);
            if (!mockData.some((d) => !d)) {
              submit("", {
                action: "/test",
                method: "POST",
                navigate: false,
              });
            }
          }}
          disabled={mockData.some((d) => !d)}
        >
          <IconPlus />
        </button>
      </div>
      <div className="absolute bottom-10">
        <button
          className="btn btn-primary rounded-none hover:-skew-x-12"
          disabled={mockData.length === 0 || mockData.some((d) => !d)}
        >
          Focus Now
        </button>
      </div>
    </div>
  );
}

export const TaskRow = ({
  task,
  mockData,
  setMockData,
  idx,
  submit,
}: {
  task: string;
  mockData: any;
  setMockData: any;
  idx: number;
  submit: SubmitFunction;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <motion.div
      className={cn(
        "w-full relative flex flex-row justify-between items-center text-primary bg-white/10 border-none ring-0 rounded-none hover:bg-primary/50 px-2 transition-all duration-100 ease-in-out",
        isFocused && "bg-primary text-black -skew-x-12 hover:bg-primary"
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {isFocused && (
        <span className="animate-ping-once absolute inline-flex h-full w-full bg-primary opacity-75 duration-75" />
      )}

      <input
        ref={inputRef}
        value={task}
        autoFocus={!task}
        onChange={(e) => {
          const newData = [...mockData];
          newData[idx] = e.target.value;
          setMockData(newData);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            submit("", {
              action: "/test",
              method: "POST",
              navigate: false,
            });
            inputRef.current?.blur();
          }
        }}
        className="input p-0 w-full bg-transparent focus:ring-0 focus:ring-offset-0 !border-transparent !outline-none"
      />
      {hovered && (
        <button
          className="btn btn-ghost p-0 hover:bg-transparent"
          onClick={() => {
            const newData = [...mockData];
            newData.splice(idx, 1);
            setMockData(newData);
          }}
        >
          <IconTrash />
        </button>
      )}
    </motion.div>
  );
};

export const LaunchCard = () => {
  return (
    <motion.div
      key="launch-card"
      className="w-full bg-primary/20 rounded-[2rem] border-2 border-primary/50 flex justify-start items-center text-primary flex-row"
    >
      <Fancy3DImage
        image_url={
          "https://i.scdn.co/image/ab67616d0000b2739b25dfa9727ebf97a2575bdf"
        }
      />
    </motion.div>
  );
};

export const Fancy3DImage = ({ image_url }: { image_url: string }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const maxTilt = 3;
  const tiltX = hovered
    ? Math.min(Math.max(mousePos.y / 20, -maxTilt), maxTilt)
    : 0;
  const tiltY = hovered
    ? Math.min(Math.max(-mousePos.x / 20, -maxTilt), maxTilt)
    : 0;

  const cardSpring = useSpring({
    transform: `perspective(200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
  });

  return (
    <animated.div
      className="m-4 h-[14rem] w-[14rem] bg-contain bg-center bg-no-repeat rounded-3xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(event: any) => {
        const { left, top, width, height } =
          event.currentTarget.getBoundingClientRect();
        const x = event.clientX - (left + width / 2);
        const y = event.clientY - (top + height / 2);
        setMousePos({ x, y });
      }}
      style={{
        backgroundImage: `url(${image_url})`,
        ...cardSpring,
      }}
    />
  );
};
