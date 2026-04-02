// 1. First, create a context to manage music state across the app
// contexts/MusicContext.js
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const MusicContext = createContext();

export function MusicProvider({ children, musicUrl, pagesToPlayOn = [] }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const router = useRouter();

  // Initialize audio object
  useEffect(() => {
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl]);

  // Handle route changes and music state
  useEffect(() => {
    if (!audioRef.current || !isMusicEnabled) return;

    const shouldPlayOnCurrentPage =
      pagesToPlayOn.length === 0 || pagesToPlayOn.includes(router.pathname);

    if (shouldPlayOnCurrentPage) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Playback error:", err);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const handleRouteChange = (newPath) => {
      if (!isMusicEnabled) return;

      const shouldPlayOnNewPage =
        pagesToPlayOn.length === 0 || pagesToPlayOn.includes(newPath);

      if (shouldPlayOnNewPage) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, pagesToPlayOn, isMusicEnabled]);

  // Function to enable music
  const enableMusic = () => {
    setIsMusicEnabled(true);

    const shouldPlayOnCurrentPage =
      pagesToPlayOn.length === 0 || pagesToPlayOn.includes(router.pathname);

    if (shouldPlayOnCurrentPage && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Playback error:", err);
          setIsPlaying(false);
        });
    }
  };

  // Function to toggle music on/off after enabled
  const toggleMusic = () => {
 if (!isMusicEnabled) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isMusicEnabled,
        isPlaying,
        enableMusic,
        toggleMusic,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
