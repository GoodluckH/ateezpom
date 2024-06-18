import { SupportedThemes } from "~/types/theme";

export const NavBar = () => {
  return (
    <div className="fixed top-0 w-full flex flex-row justify-start items-center p-5 z-[99999999]">
      <select data-choose-theme className="">
        {Object.keys(SupportedThemes).map((themeKey, idx) => {
          const theme =
            SupportedThemes[themeKey as keyof typeof SupportedThemes];
          return (
            <option key={idx} value={theme}>
              {theme}
            </option>
          );
        })}
      </select>
    </div>
  );
};
