import { useGuideKitContext } from "../hooks/useGuideKitContext";
import { MaskGuideDim } from "./MaskGuideDim";

/**
 * GuideKitDimComponent
 **/
export function GuideKitDimComponent() {
  const { currentGuideInfo } = useGuideKitContext();

  if (currentGuideInfo?.type === "mask") {
    return <MaskGuideDim />;
  }

  return;
}
