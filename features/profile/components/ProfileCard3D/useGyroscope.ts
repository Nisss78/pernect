import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";
import {
  useSharedValue,
  withSpring,
  cancelAnimation,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

const MAX_TILT_ANGLE = 15;
const UPDATE_INTERVAL = 16; // ~60fps

export function useGyroscope(isActive: boolean = true) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    let subscription: ReturnType<typeof DeviceMotion.addListener> | null = null;

    const setupSensor = async () => {
      // Check if gyroscope is available
      const available = await DeviceMotion.isAvailableAsync();
      setIsAvailable(available);

      if (!available || !isActive) {
        // Reset to neutral position
        rotateX.value = withSpring(0, SPRING_CONFIG);
        rotateY.value = withSpring(0, SPRING_CONFIG);
        return;
      }

      // Set update interval
      DeviceMotion.setUpdateInterval(UPDATE_INTERVAL);

      // Subscribe to device motion
      subscription = DeviceMotion.addListener((data) => {
        const { rotation } = data;

        if (rotation) {
          // Convert radians to degrees and clamp to max angle
          const pitchDeg = rotation.beta * (180 / Math.PI);
          const rollDeg = rotation.gamma * (180 / Math.PI);

          // Apply smoothing with spring animation
          // Multiply by 0.5 to reduce sensitivity
          const targetX = Math.max(
            -MAX_TILT_ANGLE,
            Math.min(MAX_TILT_ANGLE, pitchDeg * 0.5)
          );
          const targetY = Math.max(
            -MAX_TILT_ANGLE,
            Math.min(MAX_TILT_ANGLE, rollDeg * 0.5)
          );

          rotateX.value = withSpring(targetX, SPRING_CONFIG);
          rotateY.value = withSpring(targetY, SPRING_CONFIG);
        }
      });
    };

    setupSensor();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      // Cancel ongoing animations
      cancelAnimation(rotateX);
      cancelAnimation(rotateY);
    };
  }, [isActive, rotateX, rotateY]);

  // Reset to neutral when becoming inactive
  useEffect(() => {
    if (!isActive) {
      rotateX.value = withSpring(0, SPRING_CONFIG);
      rotateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, [isActive, rotateX, rotateY]);

  return {
    rotateX,
    rotateY,
    isAvailable,
  };
}
