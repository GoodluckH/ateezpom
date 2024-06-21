import type { MetaFunction } from "@remix-run/cloudflare";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { SubmitFunction, useSubmit } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  IconCards,
  IconCheck,
  IconDisc,
  IconPlus,
  IconTrash,
  IconTrophy,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";

import { cn } from "~/utils/styling";
import { useSpring, animated } from "react-spring";
import { NavBarContext } from "~/context/NavBarContext";
import { usePiPWindow } from "~/PiP/PiPProvider";
import PiPWindow from "~/PiP/PiPWindow";
import { Task } from "~/types/task";
import { v4 as uuidv4 } from "uuid";

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
  const [mockData, setMockData] = useState<Task[]>([]);
  const { showAlbumCard, setShowAlbumCard } = useContext(NavBarContext);
  const submit = useSubmit();
  const [addingTask, setAddingTask] = useState(false);
  const { isSupported, requestPipWindow, pipWindow, closePipWindow } =
    usePiPWindow();

  const startPiP = useCallback(() => {
    requestPipWindow(200, 1);
  }, [requestPipWindow]);

  const handleAddTask = () => {
    if (!showAlbumCard) setAddingTask(true);
    setShowAlbumCard(true);

    const addTask = () => {
      setMockData((prevMockData) => [
        ...prevMockData,
        {
          id: uuidv4(),
          title: "",
          completed: false,
          positionInList: prevMockData.length,
        },
      ]);
      setAddingTask(false);
    };

    if (showAlbumCard) {
      addTask();
    } else {
      setTimeout(() => {
        addTask();
      }, 500);
    }
  };

  useEffect(() => {
    if (!mockData.some((d) => !d)) {
      submit("", {
        action: "/test",
        method: "POST",
        navigate: false,
      });
    }
  }, [mockData, submit]);

  return (
    <div className="w-full relative h-screen flex flex-col justify-center items-center">
      <motion.div className="w-full max-w-2xl gap-3 flex flex-col px-2">
        <AnimatePresence key={"animateNavCard"}>
          {mockData.length === 0 && !addingTask && (
            <motion.div layoutId={"navCard"}>
              <LaunchCard />
            </motion.div>
          )}
        </AnimatePresence>

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

        {!addingTask && (
          <button
            type="button"
            className="btn btn-primary w-full rounded-none"
            onClick={handleAddTask}
            disabled={mockData.some((d) => !d.title) || addingTask}
          >
            <IconPlus strokeWidth={4} />
          </button>
        )}
        {!showAlbumCard && (
          <div className="text-xs text-center">
            Start slaying by creating your first task
          </div>
        )}
      </motion.div>

      {pipWindow && (
        <PiPWindow pipWindow={pipWindow}>
          <div className="text-primary w-full h-full flex flex-row justify-between items-center px-2">
            <div className="btn btn-sm btn-circle btn-ghost btn-disabled"></div>
            {mockData.find((d) => !d.completed)?.title}
            <button
              className="btn btn-sm btn-circle"
              onClick={() => {
                pipWindow.confetti({
                  particleCount: 50,
                  angle: 170,
                  scalar: 1.8,
                  spread: 10,
                  origin: { x: 1 },
                  shapes: ["emoji"],
                  shapeOptions: {
                    emoji: {
                      value: ["💵", "🤑", "💸"],
                    },
                  },
                });
                const newData = [...mockData];
                const idx = newData.findIndex((d) => !d.completed);
                newData[idx].completed = true;
                setMockData(newData);
              }}
              // disabled={mockData.find((d) => !d.completed) === undefined}
            >
              <IconCheck />
            </button>
          </div>
        </PiPWindow>
      )}
      <div className="absolute bottom-10">
        <button
          className="btn btn-primary rounded-none hover:-skew-x-12"
          disabled={mockData.length === 0 || mockData.some((d) => !d)}
          onClick={() => startPiP()}
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
  task: Task;
  mockData: Task[];
  setMockData: any;
  idx: number;
  submit: SubmitFunction;
}) => {
  const { setShowAlbumCard } = useContext(NavBarContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <motion.div
      key={task.id}
      className={cn(
        "w-full relative flex flex-row justify-between items-center text-primary bg-white/10 border-none ring-0 rounded-none hover:bg-primary/50 px-2 transition-all duration-100 ease-in-out",
        isFocused && "bg-primary text-black -skew-x-12 hover:bg-primary"
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      // animate={{ scale: 1, opacity: 1 }}
      // exit={{ scale: 0.8, opacity: 0 }}
      // transition={{ type: "spring" }}
    >
      {isFocused && (
        <span className="animate-ping-once absolute inline-flex h-full w-full bg-primary opacity-75 duration-75" />
      )}

      <input
        ref={inputRef}
        value={task.title}
        autoFocus={!task.title}
        onChange={(e) => {
          const newData = [...mockData];
          newData[idx].title = e.target.value;
          setMockData(newData);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          if (!task.title) {
            const newData = [...mockData];
            newData.splice(idx, 1);
            setMockData(newData);
            if (newData.length === 0) {
              setShowAlbumCard(false);
            }
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            submit("", {
              action: "/test",
              method: "POST",
              navigate: false,
            });
            inputRef.current?.blur();
            setMockData((prevMockData: Task[]) => [
              ...prevMockData,
              {
                id: uuidv4(),
                title: "",
                completed: false,
                positionInList: mockData.length,
              },
            ]);
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

export const LaunchCard = ({ isMini = false }: { isMini?: boolean }) => {
  return (
    <motion.div
      className={cn(
        "relative w-full bg-primary/20 rounded-[2rem] border-2 border-primary/50 flex justify-start items-center text-primary flex-row",
        isMini ? "w-40 h-[56px] rounded-xl" : ""
      )}
    >
      <Fancy3DImage
        image_url={
          "https://i.scdn.co/image/ab67616d0000b2739b25dfa9727ebf97a2575bdf"
        }
        className={isMini ? "w-[45px] h-[45px] rounded-md m-1" : ""}
      />

      {isMini && (
        <motion.div className="ml-1">
          <div className="font-light text-sm leading-none">Your Cards</div>
          <div className="font-bold text-2xl leading-none">0 / 24</div>
        </motion.div>
      )}

      {!isMini && (
        <>
          <motion.div
            className="flex absolute right-4 badge bg-primary/50 border-none font-light top-3 tooltip tooltip-left"
            data-tip="2303 users are on this track"
          >
            <IconWorld strokeWidth={1} className="h-5 w-5" />
            2303
          </motion.div>
          <motion.div className="flex flex-col text-primary justify-between h-full py-4">
            <div className="flex flex-row justify-start items-center gap-2">
              <IconUsersGroup className="w-10 h-10" strokeWidth={1} />
              <div className="flex flex-col justify-start ">
                <div className="font-light text-sm leading-0">Group</div>
                <div className="font-bold md:text-lg leading-0">Ateez</div>
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <IconTrophy className="w-10 h-10" strokeWidth={1} />
              <div className="flex flex-col justify-start ">
                <div className="font-light text-sm leading-0">Group Rank</div>
                <div className="font-bold  md:text-lg leading-0">#1</div>
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <IconDisc className="w-10 h-10" strokeWidth={1} />
              <div className="flex flex-col justify-start ">
                <div className="font-light text-sm leading-0">Theme</div>
                <div className="font-bold  md:text-lg leading-0">
                  Golden Hour Part.1
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
              <IconCards className="w-10 h-10" strokeWidth={1} />
              <div className="flex flex-col justify-start ">
                <div className="font-light text-sm leading-0"># of Cards</div>
                <div className="font-bold  md:text-lg leading-0">24</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export const Fancy3DImage = ({
  image_url,
  className,
}: {
  image_url: string;
  className?: string;
}) => {
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
      className={cn(
        "m-4 h-[14rem] w-[14rem] bg-contain bg-center bg-no-repeat rounded-3xl",
        className
      )}
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
