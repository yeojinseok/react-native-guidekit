import React from "react";
import { MaskGuideType } from "../types";
import {
  GestureResponderEvent,
  LayoutRectangle,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useGuideKitContext } from "../hooks/useGuideKitContext";
import Svg, { Path } from "react-native-svg";
import { Chip } from "react-native-paper";

const TOOLTIP_ARROW_HEIGHT = 13;
const TOOLTIP_ARROW_WIDTH = 20;
const TOOLTIP_WIDTH = 280;

export const MaskGuideDim = React.memo(function MaskGuideDim() {
  const { width, height } = useWindowDimensions();

  const {
    currentGuideInfo,
    goNextStep,
    onCloseRef,
    closeGuide,
  } = useGuideKitContext();

  const onTouchEndHandler = (event: GestureResponderEvent) => {
    if (!currentGuideInfo) {
      return;
    }

    if (currentGuideInfo.position != null) {
      const { pageX, pageY } = event.nativeEvent;

      const enableLeftX = currentGuideInfo.position.x;
      const enableRightX =
        currentGuideInfo.position.x + currentGuideInfo.position.width;
      const enableTopY = currentGuideInfo.position.y;
      const enableBottomY =
        currentGuideInfo.position.y + currentGuideInfo.position.height;

      if (
        pageX > enableLeftX &&
        pageX < enableRightX &&
        pageY > enableTopY &&
        pageY < enableBottomY
      ) {
        currentGuideInfo.onPress?.();
        goNextStep();
        return;
      }

      if (onCloseRef.current != null) {
        onCloseRef.current();
        return;
      }

      closeGuide();
    }
  };

  if (!currentGuideInfo?.position) {
    return null;
  }

  return (
    <View
      onTouchEnd={onTouchEndHandler}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 100,
        position: "absolute",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          width: width,
          height: height,
          zIndex: 999999,
        }}
      >
        <Svg
          style={{
            flex: 1,
          }}
        >
          <Path
            d={defaultSvgPath({
              size: {
                x: currentGuideInfo.position.width,
                y: currentGuideInfo.position.height,
              },
              position: {
                x: currentGuideInfo.position.x,
                y: currentGuideInfo.position.y,
              },
              canvasSize: { x: width, y: height },
              borderRadius: 8,
            })}
            fillRule="evenodd"
            strokeWidth={1}
            fill="black"
            opacity={0.4}
          />
        </Svg>

        <TooltipSection guideInfo={currentGuideInfo} />
      </View>
    </View>
  );
});

/**
 * TooltipSection
 **/
const TooltipSection = React.memo(function TooltipSection({
  guideInfo,
}: {
  guideInfo: MaskGuideType;
}) {
  const [tooltipLayout, setTooltipPosition] =
    React.useState<Pick<LayoutRectangle, "height" | "width">>();

  if (!guideInfo.position || !guideInfo.tooltip) {
    return null;
  }

  const getTooltipPosition = () => {
    if (!guideInfo.position || !tooltipLayout) {
      return {};
    }

    if (guideInfo.tooltip?.position === 'topCenter') {
      return {
        top: -tooltipLayout.height - 8 - TOOLTIP_ARROW_HEIGHT,
        left: guideInfo.position.width / 2 - tooltipLayout.width / 2,
      };
    }
    if (guideInfo.tooltip?.position === 'topRight') {
      return {
        top: -tooltipLayout.height - 8 - TOOLTIP_ARROW_HEIGHT,
        right: 0,
      };
    }
    if (guideInfo.tooltip?.position === 'topLeft') {
      return {
        top: -tooltipLayout.height - 8 - TOOLTIP_ARROW_HEIGHT,
        left: 0,
      };
    }

    if (guideInfo.tooltip?.position === 'bottomCenter') {
      return {
        top: guideInfo.position.height + 24,
        left: guideInfo.position.width / 2 - tooltipLayout.width / 2,
      };
    }
    if (guideInfo.tooltip?.position === 'bottomRight') {
      return {
        top: guideInfo.position.height + 24,
        right: 0,
      };
    }
    if (guideInfo.tooltip?.position === 'bottomLeft') {
      return {
        top: guideInfo.position.height + 24,
        left: 0,
      };
    }

    return {};
  };

  return (
    <View
      style={{
        position: "absolute",
        top: guideInfo.position.y,
        left: guideInfo.position.x,
        width: guideInfo.position.width,
        height: guideInfo.position.height,
        zIndex: 100000,
      }}
    >
      <View
        pointerEvents="none"
        style={{ position: "absolute", opacity: 0 }}
        onLayout={({ nativeEvent }) => setTooltipPosition(nativeEvent.layout)}
      >
        <Tooltip
          {...guideInfo.tooltip}
          arrowPosition={guideInfo.tooltip.}
        />
      </View>
      {tooltipLayout && (
        <View
          style={{
            position: "absolute",
            ...getTooltipPosition(),
          }}
        >
          <Tooltip
            {...guideInfo.tooltip}
          />
        </View>
      )}
    </View>
  );
});

/**
 * Tooltip
 **/
const Tooltip = React.memo(function Tooltip(
  props: MaskGuideType["tooltip"]
) {
  const { currentGuideInfo, goNextStep } = useGuideKitContext();

  const getTooltipArrowPosition = () => {
    if (props?.arrowPosition === 'topLeft') {
      return {
        left: 16,
        bottom: -TOOLTIP_ARROW_HEIGHT + 2,
      };
    }
    if (props?.arrowPosition === 'topRight') {
      return {
        right: 16,
        bottom: -TOOLTIP_ARROW_HEIGHT + 2,
      };
    }

    if (props?.arrowPosition === 'topCenter') {
      return {
        left: TOOLTIP_WIDTH / 2 - TOOLTIP_ARROW_WIDTH / 2,
        bottom: -TOOLTIP_ARROW_HEIGHT + 2,
      };
    }

    if (props?.arrowPosition === 'bottomCenter') {
      return {
        transform: [{ rotate: '180deg' }],
        top: -TOOLTIP_ARROW_HEIGHT + 2,
        left: TOOLTIP_WIDTH / 2 - TOOLTIP_ARROW_WIDTH / 2,
      };
    }

    if (props?.arrowPosition === 'bottomLeft') {
      return {
        transform: [{ rotate: '180deg' }],
        top: -TOOLTIP_ARROW_HEIGHT + 2,
        left: 16,
      };
    }
    if (props?.arrowPosition === 'bottomRight') {
      return {
        transform: [{ rotate: '180deg' }],
        top: -TOOLTIP_ARROW_HEIGHT + 2,
        right: 16,
      };
    }
  };

  return (
    <View>
      <View style={{ borderRadius: 16, width: TOOLTIP_WIDTH, padding: 20 }}>
        <Text>{props?.title}</Text>
        <View style={{ minHeight: 57 }}>
          <Text>{props?.content}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Chip
            onPress={() => {
              props?.onPressButton?.();
              goNextStep();
            }}
          >
            <></>
          </Chip>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: -TOOLTIP_ARROW_HEIGHT + 2,
          ...getTooltipArrowPosition(),
        }}
      >
        <ArrowDownIcon />
      </View>
    </View>
  );
});

const defaultSvgPath = ({
  size,
  position,
  canvasSize,
  borderRadius,
}: {
  size: { x: number; y: number };
  position: { x: number; y: number };
  canvasSize: { x: number; y: number };
  borderRadius: number;
}): string => {
  const positionX = position.x;
  const positionY = position.y;
  const sizeX = size.x;
  const sizeY = size.y;

  return (
    `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${
      positionX + borderRadius
    },${positionY}` +
    `H${positionX + sizeX - borderRadius}` +
    `A${borderRadius},${borderRadius} 0 0 1 ${positionX + sizeX},${
      positionY + borderRadius
    }` +
    `V${positionY + sizeY - borderRadius}` +
    `A${borderRadius},${borderRadius} 0 0 1 ${
      positionX + sizeX - borderRadius
    },${positionY + sizeY}` +
    `H${positionX + borderRadius}` +
    `A${borderRadius},${borderRadius} 0 0 1 ${positionX},${
      positionY + sizeY - borderRadius
    }` +
    `V${positionY + borderRadius}` +
    `A${borderRadius},${borderRadius} 0 0 1 ${
      positionX + borderRadius
    },${positionY}Z`
  );
};

const ArrowDownIcon = React.memo(function ArrowDownIcon({
  width = 20,
  height = 13,
  fill = "white",
}: {
  width?: number;
  height?: number;
  fill?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 13" fill="none">
      <Path
        d="M11.488 12.3432C10.6933 13.228 9.30668 13.228 8.51201 12.3432L0.872037 3.83637C-0.284285 2.54885 0.629483 0.5 2.36003 0.5L17.64 0.500001C19.3705 0.500002 20.2843 2.54885 19.128 3.83637L11.488 12.3432Z"
        fill={fill}
      />
    </Svg>
  );
});
