import React from "react";
import { GuideKetContext } from "./useGuideKitContext";

/**
 * useGuideKitState
 **/
export function useGuideKitState() {
  const context = React.useContext(GuideKetContext);

  if (!context) {
    throw new Error("useGuideKitState must be used within a GuideKitProvider");
  }

  return {
    currentGuideInfo: context.currentGuideInfo,
    currentGuideKey: context.currentGuideKey,
    startGuide: context.startGuide,
  };
}
