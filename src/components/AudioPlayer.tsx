import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Sound from "react-native-sound";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  source: string;
};

export default function AudioPlayer({ source }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Load audio
    const sound = new Sound(source, undefined, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
    });

    soundRef.current = sound;

    return () => {
      sound.release(); // cleanup
    };
  }, [source]);

  const togglePlayPause = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play(() => {
        setIsPlaying(false); // reset when finished
      });
      setIsPlaying(true);
    }
  };

  const restart = () => {
    if (!soundRef.current) return;
    soundRef.current.setCurrentTime(0);
    soundRef.current.play();
    setIsPlaying(true);
  };

  return (
    <View style={styles.container}>
      {/* Play / Pause */}
      <TouchableOpacity onPress={togglePlayPause}>
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={64}
          color="#F7543E"
        />
      </TouchableOpacity>

      {/* Restart */}
      <TouchableOpacity onPress={restart}>
        <Ionicons name="refresh-circle" size={64} color="#F7543E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
