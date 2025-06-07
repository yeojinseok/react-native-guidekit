import React from "react";

import { GuideKetContext } from "../hooks/useGuideKitContext";
import { GuideKitContextType, GuideKitCustomTypes, GuideType } from "../types";

/**
 * GuideKitProvider
 **/
export function GuideKitProvider({ children }: { children: React.ReactNode }) {
  const onCompleteRef = React.useRef<() => void>();
  const onCloseRef = React.useRef<() => void>();
  const guideKeyListRef = React.useRef<GuideKitCustomTypes["guideKeyType"][]>(
    []
  );

  const [currentGuideKey, setCurrentGuideKey] = React.useState<
    GuideKitCustomTypes["guideKeyType"] | null
  >(null);

  const [guideInfoMap, setGuideInfoMap] = React.useState<
    Map<GuideKitCustomTypes["guideKeyType"], GuideType>
  >(new Map());

  const currentGuideInfo = React.useMemo(() => {
    if (!currentGuideKey) {
      return null;
    }

    if (guideInfoMap.has(currentGuideKey)) {
      return guideInfoMap.get(currentGuideKey) ?? null;
    }
    return null;
  }, [currentGuideKey, guideInfoMap]);

  const startGuide = React.useCallback(
    ({
      guideKeyList,
      onComplete,
      onClose,
    }: {
      guideKeyList: GuideKitCustomTypes["guideKeyType"][];
      onComplete?: () => void;
      onClose?: () => void;
    }) => {
      onCompleteRef.current = onComplete;
      onCloseRef.current = onClose;
      guideKeyListRef.current = guideKeyList;

      if (guideKeyList.length > 0) {
        setCurrentGuideKey(guideKeyList[0]);
      }
    },
    []
  );

  const closeGuide = React.useCallback(() => {
    onCompleteRef.current = undefined;
    onCloseRef.current = undefined;
    guideKeyListRef.current = [];
    setCurrentGuideKey(null);
    setGuideInfoMap(new Map());
  }, []);

  const goNextStep = React.useCallback(() => {
    if (!currentGuideKey) {
      return;
    }

    const currentIndex = guideKeyListRef.current.indexOf(currentGuideKey);
    const nextIndex = currentIndex + 1;

    if (nextIndex < guideKeyListRef.current.length) {
      setCurrentGuideKey(guideKeyListRef.current[nextIndex]);
      return;
    }

    onCompleteRef.current?.();

    closeGuide();
  }, [currentGuideKey, guideInfoMap]);

  const defaultContextValue = React.useMemo(
    () =>
      ({
        currentGuideInfo,
        currentGuideKey,
        setGuideInfoMap,
        startGuide,
        onCompleteRef,
        onCloseRef,
        goNextStep,
        closeGuide,
      } satisfies GuideKitContextType<GuideKitCustomTypes["guideKeyType"]>),
    [currentGuideInfo, currentGuideKey, setGuideInfoMap, startGuide]
  );

  return (
    <GuideKetContext.Provider value={defaultContextValue}>
      {children}
    </GuideKetContext.Provider>
  );
}
