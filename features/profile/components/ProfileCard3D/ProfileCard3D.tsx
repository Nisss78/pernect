import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { CardContent } from "./CardContent";
import { HologramOverlay } from "./HologramOverlay";
import { useGyroscope } from "./useGyroscope";

interface ProfileCard3DProps {
  userName: string;
  userIdDisplay: string;
  userMbti: string;
  userImage?: string;
  traitE: number | null;
  traitO: number | null;
  traitA: number | null;
  onPress: () => void;
  onEditPress?: () => void;
  onSharePress?: () => void;
  isModalOpen: boolean;
}

export function ProfileCard3D({
  userName,
  userIdDisplay,
  userMbti,
  userImage,
  traitE,
  traitO,
  traitA,
  onPress,
  onEditPress,
  onSharePress,
  isModalOpen,
}: ProfileCard3DProps) {
  // Gyroscope hook - disabled when modal is open
  const { rotateX, rotateY, isAvailable } = useGyroscope(!isModalOpen);

  // Scale for press feedback
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  // 3D card animated style
  const cardAnimatedStyle = useAnimatedStyle(() => {
    // Calculate dynamic shadow based on tilt
    const shadowOffsetX = interpolate(rotateY.value, [-15, 15], [-8, 8]);
    const shadowOffsetY = interpolate(rotateX.value, [-15, 15], [8, -8]) + 6;
    const shadowOpacity = 0.25 + Math.abs(rotateX.value + rotateY.value) * 0.008;
    const shadowRadius = 12 + Math.abs(rotateX.value + rotateY.value) * 0.3;

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${-rotateX.value}deg` }, // Inverted for natural feel
        { rotateY: `${rotateY.value}deg` },
        { scale: scale.value },
      ],
      shadowColor: "#000",
      shadowOffset: {
        width: shadowOffsetX,
        height: shadowOffsetY,
      },
      shadowOpacity,
      shadowRadius,
      elevation: 12,
    };
  });

  // Tap gesture
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      isPressed.value = true;
      scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
    })
    .onFinalize((_, success) => {
      isPressed.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      if (success) {
        runOnJS(onPress)();
      }
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        <LinearGradient
          colors={["#ec4899", "#8b5cf6", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Hologram overlay - only show if gyroscope available */}
          {isAvailable && (
            <HologramOverlay rotateX={rotateX} rotateY={rotateY} />
          )}

          {/* Card content */}
          <CardContent
            userName={userName}
            userIdDisplay={userIdDisplay}
            userMbti={userMbti}
            userImage={userImage}
            traitE={traitE}
            traitO={traitO}
            traitA={traitA}
            onEditPress={onEditPress}
            onSharePress={onSharePress}
          />
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  gradient: {
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
});
