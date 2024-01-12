import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SESSIONS = [25, 5, 25, 10, 25, 15, 25, 20];

export function Clock() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const [sessionIndex, setSessionIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  const hold = Gesture.LongPress().onStart(() => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    setIsPaused(true);
    setMinutes(SESSIONS[sessionIndex]);
    setSeconds(0);
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      setIsPaused((p) => !p);
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
        <View style={styles.container}>
          <Text style={styles.minutes}>{minutes}</Text>
          <Text style={styles.seconds}>{formatWithLeadingZero(seconds)}</Text>
        </View>
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
