import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = (onSpeechEnd) => {
  const [recognition, setRecognition] = useState(null);
  const [speechText, setSpeechText] = useState("");
  const [recording, setRecording] = useState(false);
  const imageRef = useRef();

  const handleSpeechResult = (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0].transcript)
      .join("");
    setSpeechText(transcript);
    console.log("Transcript:", transcript);
  };

  const handleSpeechEnd = (e) => {
    e?.stopImmediatePropagation();
    setRecording(false);
    console.log("Speech Ended");

    if (onSpeechEnd && imageRef.current) {
      imageRef.current.click();
    }
  };

  const startSpeechRecognition = () => {
    if (recording || !recognition) return; // Prevent multiple starts
    setRecording(true);
    console.log("Recording Started");
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    recognition?.stop();
    console.log("Recording Stopped");
    setRecording(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.interimResults = false;
    // recognitionInstance.maxAlternatives = 1;
    recognitionInstance.lang = "en-IN";

    setRecognition(recognitionInstance);

    recognitionInstance.addEventListener("result", handleSpeechResult);
    recognitionInstance.addEventListener("end", handleSpeechEnd);

    return () => {
      recognitionInstance.removeEventListener("result", handleSpeechResult);
      recognitionInstance.removeEventListener("end", handleSpeechEnd);
    };
  }, []);

  return {
    recording,
    speechText,
    startSpeechRecognition,
    stopSpeechRecognition,
    imageRef,
  };
};

export default useSpeechRecognition;
