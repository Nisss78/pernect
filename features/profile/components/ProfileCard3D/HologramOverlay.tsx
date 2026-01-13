import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

interface HologramOverlayProps {
  rotateX: SharedValue<number>;
  rotateY: SharedValue<number>;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function HologramOverlay({ rotateX, rotateY }: HologramOverlayProps) {
  // Calculate shimmer position based on tilt
  const shimmerPosition = useDerivedValue(() => {
    return interpolate(rotateY.value, [-15, 15], [0, 1]);
  });

  // Calculate total tilt magnitude for opacity
  const tiltMagnitude = useDerivedValue(() => {
    return Math.abs(rotateX.value) + Math.abs(rotateY.value);
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(tiltMagnitude.value, [0, 20], [0.1, 0.5]),
      transform: [
        { translateX: interpolate(shimmerPosition.value, [0, 1], [-150, 150]) },
        { rotate: "45deg" },
      ],
    };
  });

  // Rainbow highlight that moves with tilt
  const rainbowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(tiltMagnitude.value, [0, 15], [0.05, 0.25]),
      transform: [
        { translateX: interpolate(rotateY.value, [-15, 15], [-100, 100]) },
        { translateY: interpolate(rotateX.value, [-15, 15], [-50, 50]) },
      ],
    };
  });

  return (
    <>
      {/* Main shimmer stripe */}
      <Animated.View
        style={[styles.shimmerContainer, shimmerStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0.6)",
            "rgba(255, 255, 255, 0.4)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>

      {/* Rainbow hologram effect */}
      <Animated.View
        style={[styles.rainbowContainer, rainbowStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            "rgba(236, 72, 153, 0.3)", // Pink
            "rgba(139, 92, 246, 0.3)", // Purple
            "rgba(59, 130, 246, 0.3)", // Blue
            "rgba(16, 185, 129, 0.3)", // Green
            "rgba(245, 158, 11, 0.3)", // Amber
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rainbowGradient}
        />
      </Animated.View>

      {/* Sparkle overlay */}
      <Animated.View
        style={[
          styles.sparkleOverlay,
          useAnimatedStyle(() => ({
            opacity: interpolate(tiltMagnitude.value, [0, 20], [0, 0.15]),
          })),
        ]}
        pointerEvents="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  shimmerContainer: {
    position: "absolute",
    top: -100,
    left: -50,
    width: 100,
    height: 400,
    overflow: "hidden",
  },
  shimmerGradient: {
    width: "100%",
    height: "100%",
  },
  rainbowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  rainbowGradient: {
    width: "150%",
    height: "150%",
  },
  sparkleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
