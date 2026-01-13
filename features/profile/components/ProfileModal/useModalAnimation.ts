import { Dimensions } from "react-native";
import {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Default card dimensions (will be measured)
const DEFAULT_CARD_WIDTH = SCREEN_WIDTH - 48;
const DEFAULT_CARD_HEIGHT = 280;

interface CardOrigin {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TIMING_CONFIG_OPEN = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const TIMING_CONFIG_CLOSE = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export function useModalAnimation() {
  const isOpen = useSharedValue(false);
  const progress = useSharedValue(0);

  // Store card position for transition
  const cardOrigin = useSharedValue<CardOrigin>({
    x: 24,
    y: 150,
    width: DEFAULT_CARD_WIDTH,
    height: DEFAULT_CARD_HEIGHT,
  });

  const open = (
    origin: CardOrigin,
    onComplete?: () => void
  ) => {
    cardOrigin.value = origin;
    isOpen.value = true;
    progress.value = withTiming(1, TIMING_CONFIG_OPEN, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });
  };

  const close = (onComplete?: () => void) => {
    progress.value = withTiming(0, TIMING_CONFIG_CLOSE, (finished) => {
      if (finished) {
        isOpen.value = false;
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }
    });
  };

  // Modal overlay (backdrop) style
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    pointerEvents: isOpen.value ? ("auto" as const) : ("none" as const),
  }));

  // Modal card transformation style
  const modalCardStyle = useAnimatedStyle(() => {
    const { x, y, width, height } = cardOrigin.value;

    return {
      position: "absolute" as const,
      left: interpolate(progress.value, [0, 1], [x, 0]),
      top: interpolate(progress.value, [0, 1], [y, 0]),
      width: interpolate(progress.value, [0, 1], [width, SCREEN_WIDTH]),
      height: interpolate(progress.value, [0, 1], [height, SCREEN_HEIGHT]),
      borderRadius: interpolate(progress.value, [0, 1], [20, 0]),
      overflow: "hidden" as const,
    };
  });

  // Content opacity (fade in after 50% progress)
  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
  }));

  // Header scale animation
  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 1]),
      },
    ],
  }));

  return {
    isOpen,
    progress,
    open,
    close,
    overlayStyle,
    modalCardStyle,
    contentStyle,
    headerStyle,
  };
}
