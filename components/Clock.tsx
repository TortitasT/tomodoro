import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const SESSIONS = [25, 5, 25, 10, 25, 15, 25, 20];

export function Clock() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const [sessionIndex, setSessionIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  function longPress() {
    if (isPaused) {
      setIsPaused(false);
    }

    setIsPaused(true);
    setMinutes(SESSIONS[sessionIndex]);
    setSeconds(0);
  }

  const hold = Gesture.LongPress().onStart(() => {
    runOnJS(longPress)();
    // if (isPaused) {
    //   runOnJS(setIsPaused)(false);
    //   return;
    // }
    //
    // runOnJS(setIsPaused)(true);
    // runOnJS(setMinutes)(SESSIONS[sessionIndex]);
    // runOnJS(setSeconds)(0);
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(setIsPaused)(true);
    });

  function formatWithLeadingZero(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      if (seconds === 0) {
        if (minutes === 0) {
          setSessionIndex((i) => (i + 1) % SESSIONS.length);
          setMinutes(SESSIONS[sessionIndex]);
        } else {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <GestureDetector gesture={doubleTap}>
      <GestureDetector gesture={hold}>
        <Animated.View style={styles.container}>
          <Text style={styles.minutes}>{minutes}</Text>
          <Text style={styles.seconds}>{formatWithLeadingZero(seconds)}</Text>
        </Animated.View>
      </GestureDetector>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  minutes: {
    fontSize: 75,
    fontWeight: "bold",
  },
  seconds: {
    fontSize: 30,
  },
});
