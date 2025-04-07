import React, { createContext, useContext } from "react";

export type MapContextProps = {
  amap_js_key: string | null;
}

const AppContext = createContext<MapContextProps>({
  amap_js_key: null,
});

export function AppContextProvider({
  children,
  amap_js_key,
}: { children: React.ReactNode } & MapContextProps) {
  return (
    <AppContext.Provider value={{ amap_js_key }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
