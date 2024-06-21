import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { NavBarContext } from "~/context/NavBarContext";
import { LaunchCard } from "~/routes/_index";
import { motion } from "framer-motion";
export const NavBar = () => {
  const { showAlbumCard } = useContext(NavBarContext);
  return (
    <div className="fixed top-0 w-full flex flex-row justify-start items-center p-5 z-[99999999]">
      <AnimatePresence>
        {showAlbumCard && (
          <motion.div layoutId="navCard">
            <LaunchCard isMini={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
