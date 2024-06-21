import { createContext } from "react";

export const NavBarContext = createContext<{
  showAlbumCard: boolean;
  setShowAlbumCard: (show: boolean) => void;
}>({
  showAlbumCard: false,
  setShowAlbumCard: () => {},
});
