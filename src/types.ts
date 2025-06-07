export interface GuideKitCustomTypes {
  guideKeyType: string;
}

export type PointerPositionType =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "topCenter"
  | "bottomCenter";

export type MaskGuideType = {
  type: "mask";
  position?: { x: number; y: number; width: number; height: number };
  onPress?: (...args: any) => any;
  tooltip?: {
    position?: PointerPositionType;
    title?: React.ReactNode;
    content?: React.ReactNode;
    buttonText?: React.ReactNode;
    onPressButton?: () => void;
    arrowPosition: PointerPositionType;
  };
};

export type GuideType = MaskGuideType;

export type GuideKitContextType<T extends GuideKitCustomTypes["guideKeyType"]> =
  {
    currentGuideInfo: GuideType | null;
    currentGuideKey: T | null;
    setGuideInfoMap: (
      value: Map<GuideKitCustomTypes["guideKeyType"], GuideType>
    ) => void;
    startGuide: (args: {
      guideKeyList: T[];
      onComplete?: () => void;
      onClose?: () => void;
    }) => void;
    goNextStep: () => void;
    closeGuide: () => void;
    onCompleteRef: React.MutableRefObject<(() => void) | undefined>;
    onCloseRef: React.MutableRefObject<(() => void) | undefined>;
  };
