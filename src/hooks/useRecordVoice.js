// import { useEffect, useState, useRef } from "react";

// export const useRecordVoice = () => {
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [recording, setRecording] = useState(false);
//   const [recordingAudio, setRecordingAudio] = useState(null);
//   const chunks = useRef([]);

//   // Function to start the recording
//   const startRecording = () => {
//     if (mediaRecorder) {
//       if (mediaRecorder.state === "recording") {
//         console.log("Already recording...");
//         return; // Prevent starting a new recording if one is already in progress
//       }
//       mediaRecorder.start();
//       setRecording(true);
//       setRecordingAudio(null);
//       console.log("Recording started...");
//     } else {
//       console.log("MediaRecorder not initialized yet.");
//     }
//   };

//   // Function to stop the recording
//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === "recording") {
//       mediaRecorder.stop();
//       setRecording(false);
//       console.log("Recording stopped...");
//     }
//   };

//   // Function to initialize the media recorder with the provided stream
//   const initialMediaRecorder = (stream) => {
//     const mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.onstart = () => {
//       chunks.current = [];
//     };

//     mediaRecorder.ondataavailable = (ev) => {
//       chunks.current.push(ev.data);
//     };

//     mediaRecorder.onstop = () => {
//       const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
//       setRecordingAudio(audioBlob);
//     };

//     setMediaRecorder(mediaRecorder);
//   };

// useEffect(() => {
//   if (typeof window !== "undefined") {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then(initialMediaRecorder)
//       .catch((err) => console.error("Error accessing microphone:", err));
//   }
// }, []);

//   return { recordingAudio, recording, startRecording, stopRecording };
// };

// import { useEffect, useState, useRef } from "react";

// export const useRecordVoice = () => {
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [recording, setRecording] = useState(false);
//   const [recordingAudio, setRecordingAudio] = useState(null);
//   const [permissionState, setPermissionState] = useState("pending"); // "pending", "granted", "denied"
//   const chunks = useRef([]);

//   // Function to start the recording
//   const startRecording = () => {
//     if (mediaRecorder) {
//       if (mediaRecorder.state === "recording") {
//         console.log("Already recording...");
//         return; // Prevent starting a new recording if one is already in progress
//       }
//       mediaRecorder.start();
//       setRecording(true);
//       setRecordingAudio(null);
//       console.log("Recording started...");
//     } else {
//       // Instead of logging an error, you can handle the permission state
//       if (permissionState === "denied") {
//         // Silently handle the case where permission was denied
//         return;
//       }

//       if (process.env.NODE_ENV !== "production") {
//         console.log("MediaRecorder not initialized yet.");
//       }
//     }
//   };

//   // Function to stop the recording
//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === "recording") {
//       mediaRecorder.stop();
//       setRecording(false);
//       console.log("Recording stopped...");
//     }
//   };

//   // Function to initialize the media recorder with the provided stream
//   const initialMediaRecorder = (stream) => {
//     const mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.onstart = () => {
//       chunks.current = [];
//     };

//     mediaRecorder.ondataavailable = (ev) => {
//       chunks.current.push(ev.data);
//     };

//     mediaRecorder.onstop = () => {
//       const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
//       setRecordingAudio(audioBlob);
//     };

//     setMediaRecorder(mediaRecorder);
//     setPermissionState("granted");
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then(initialMediaRecorder)
//         .catch((err) => {
//           // Check for permission error specifically
//           if (err.name === "NotAllowedError") {
//             setPermissionState("denied");
//             // Only log in development environment
//             if (process.env.NODE_ENV !== "production") {
//               console.log("Microphone permission was denied");
//             }
//           } else {
//             // For other errors, you might want different handling
//             setPermissionState("error");
//             if (process.env.NODE_ENV !== "production") {
//               console.error("Error accessing microphone:", err);
//             }
//           }
//         });
//     }
//   }, []);

//   return {
//     recordingAudio,
//     recording,
//     startRecording,
//     stopRecording,
//     permissionState  // Expose permission state to the component
//   };
// };

"use client";
import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(null);
  const [permissionState, setPermissionState] = useState("pending"); // "pending", "granted", "denied"
  const chunks = useRef([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder)
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);

  // Function to start the recording
  const startRecording = () => {
    // Request microphone permission when starting the recording
    if (permissionState === "pending") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder)
        .catch((err) => {
          if (err.name === "NotAllowedError") {
            setPermissionState("denied");
            if (process.env.NODE_ENV !== "production") {
              console.log("Microphone permission was denied");
            }
          } else {
            setPermissionState("error");
            if (process.env.NODE_ENV !== "production") {
              console.error("Error accessing microphone:", err);
            }
          }
        });
      return;
    }

    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        console.log("Already recording...");
        return; // Prevent starting a new recording if one is already in progress
      }
      mediaRecorder.start();
      setRecording(true);
      setRecordingAudio(null);
      console.log("Recording started...");
    } else {
      if (permissionState === "denied") {
        return; // Silently handle the case where permission was denied
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("MediaRecorder not initialized yet.");
      }
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecording(false);
      console.log("Recording stopped...");
    }
  };

  // Function to initialize the media recorder with the provided stream
  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      setRecordingAudio(audioBlob);
    };

    setMediaRecorder(mediaRecorder);
    setPermissionState("granted");
  };

  return {
    recordingAudio,
    recording,
    startRecording,
    stopRecording,
    permissionState, // Expose permission state to the component
  };
};
