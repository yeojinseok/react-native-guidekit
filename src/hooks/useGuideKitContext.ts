import React from "react";
import { GuideKitContextType, GuideKitCustomTypes } from "../types";

export const GuideKetContext = React.createContext<GuideKitContextType<
  GuideKitCustomTypes["guideKeyType"]
> | null>(null);

/**
 * useGuideKitContext
 **/
export function useGuideKitContext() {
  const context = React.useContext(GuideKetContext);

  if (!context) {
    throw new Error(
      "useGuideKitContext must be used within a GuideKitProvider"
    );
  }

  return context;
}
