// import Options from "@/components/Options";
// import ProgressBar from "@/components/ProgressBar";
// import Timer from "@/components/Timer";
// import VerifyLoading from "@/components/VerifyLoading";
// import useSpeechRecognition from "@/hooks/useSpeechRecognition";
// import { ArrowLeft, LogOut, Mic, Volume2, VolumeOff } from "lucide-react";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
// import React, { useState, useEffect, useRef } from "react";
// import useVoiceRecorder from "@/hooks/useVoiceRecorder";
// import { blobToBase64 } from "@/components/helper";

// const Quiz = () => {
//   const {
//     recordingBlob,
//     isRecording,
//     startRecording,
//     stopRecording,
//     permissionState,
//     recordingTime,
//   } = useVoiceRecorder();
//   const [clicked, setClicked] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [ansType, setAnsType] = useState("");
//   const audioRef = useRef(null);
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [allowAudio, setAllowAudio] = useState(false); // Controls whether audio should play
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [selectedOptionForIcon, setSelectedOptionForIcon] = useState(null);
//   const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
//   const [correctOption, setCorrectOption] = useState(null);
//   const [audio, setAudio] = useState(null);
//   const searchParams = useSearchParams();
//   const [userResponceArray, setUserResponceArray] = useState([]);
//   const [animationNumber, setAnimationNumber] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isQuizCompleted, setIsQuizCompleted] = useState(false);
//   const [seconds, setSeconds] = useState(30);
//   const router = useRouter();

//   useEffect(() => {
//     const timer1 = setTimeout(() => {
//       setAnimationNumber(1);
//     }, 1500);

//     const timer2 = setTimeout(() => {
//       setAnimationNumber(2);
//     }, 1500);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       // clearTimeout(timer3);
//     };
//   }, []);

//   const language = searchParams.get("language") || "english";

//   useEffect(() => {
//     if (router.isReady && !isQuizCompleted) {
//       fetchQuestions();
//     }
//   }, [router.isReady, language, isQuizCompleted]);

//   // useEffect(() => {
//   //   if (speechText) {
//   //     verifyAnswer(speechText);
//   //   }
//   // }, [speechText]);

//   useEffect(() => {
//     if (allowAudio) {
//       playQuestionAudio();
//     }
//   }, [currentQuestionIndex]);

//   const toggleQuestionAudio = () => {
//     if (isPlaying) {
//       stopQuestionAudio();
//     } else {
//       playQuestionAudio();
//     }
//   };

//   //  `data:audio/wav;base64,${questions[currentQuestionIndex]?.audio}`;
//   const playQuestionAudio = () => {
//     // if (!allowAudio) return;

//     if (audio) {
//       audio.pause();
//     }
//     setAllowAudio(true);
//     const questionAudio = new Audio(
//       `${questions[currentQuestionIndex]?.audio_path}`
//     );

//     questionAudio
//       .play()
//       .then(() => {
//         setIsPlaying(true);
//         setAudio(questionAudio);
//       })
//       .catch((error) => console.error("Audio play error:", error));

//     questionAudio.onended = () => {
//       setIsPlaying(false);
//       if (selectedOption) return;
//       handleStartRecording();
//     };
//   };

//   const stopQuestionAudio = () => {
//     if (audio) {
//       audio.pause();
//     }
//     setIsPlaying(false);
//     setAllowAudio(false); // Prevent auto-play on question change
//   };

//   const fetchQuestions = async () => {
//     if (isQuizCompleted) return;

//     try {
//       const response = await fetch(
//         `https://api.amway.thefirstimpression.ai//api/get_all_question?lang=english`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to load questions");
//       }

//       const data = await response.json();
//       if (data?.quiz?.length > 0) {
//         setQuestions(data.quiz);
//       } else {
//         setHasError(true);
//         setErrorMessage(
//           "Unable to load quiz questions. Please try again later."
//         );
//       }
//     } catch (error) {
//       setHasError(true);
//       setErrorMessage("Unable to load quiz questions. Please try again later.");
//     }
//   };

//   const handleSkip = () => {
//     if (isQuizCompleted) return;

//     if (isRecording) return;
//     if (audio) {
//       audio.pause();
//     }
//     if (currentQuestionIndex < questions.length - 1) {
//       setSeconds(30);
//       resetState();
//       // setAllowAudio(true);
//       setIsPlaying(false);
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     }
//   };

//   const handleSubmit = () => {
//     if (isQuizCompleted) return;
//     if (selectedOption) {
//       if (audio) {
//         audio.pause();
//       }
//       setSeconds(30);
//       goToNextQuestion();
//     }
//   };

//   const goToNextQuestion = () => {
//     if (isQuizCompleted) return;

//     if (isQuizCompleted) return; // Prevent actions if quiz is completed

//     resetState();
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       completeQuiz();
//     }
//   };

//   const completeQuiz = () => {
//     setIsQuizCompleted(true); // Mark quiz as completed

//     // Stop any playing audio
//     if (audio) {
//       audio.pause();
//     }

//     try {
//       // Save data to localStorage
//       localStorage.setItem("data", JSON.stringify(userResponceArray));

//       // Navigate to login page with delay to ensure state updates first
//       setTimeout(() => {
//         router.push("/login");
//       }, 150);
//     } catch (error) {
//       console.error("Error during quiz completion:", error);
//       // Even on error, try to navigate
//       setTimeout(() => {
//         router.push("/login");
//       }, 150);
//     }
//   };

//   const resetState = () => {
//     setSelectedOption(null);
//     setIsAnswerCorrect(null);
//     setCorrectOption(null);
//   };

//   const verifyAnswer = async (userAnswer, bool) => {
//     if (!questions[currentQuestionIndex] || isQuizCompleted) return;
//     if (seconds === 2) return;

//     const body = {
//       user_answer: userAnswer,
//       question_id: questions[currentQuestionIndex].question_id,
//       lang: language,
//       onClick: bool,
//       platform: "",
//       option_one: questions[currentQuestionIndex].options[0],
//     };
//     if (selectedOption) return;
//     const startTime = Date.now();
//     try {
//       setIsLoading(true);
//       const response = await fetch("https://api.amway.thefirstimpression.ai//api/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const data = await response.json();
//       const elapsedTime = Date.now() - startTime;
//       const minLoadingTime = 800;
//       setTimeout(() => {
//         setIsLoading(false);
//         if (data.is_correct) {
//           const newAudio = new Audio("/music/rightAnswer.mp3");
//           setAudio(newAudio);
//           newAudio.play(); //
//         } else {
//           const newAudio = new Audio("/music/wrongAnswer.mp3");
//           setAudio(newAudio);
//           newAudio.play(); //
//         }
//         setIsAnswerCorrect(data.is_correct);
//         setCorrectOption(data.correct_option_key);
//         if (data.is_correct && !bool) {
//           setSelectedOption(data.correct_option_value);
//           setSelectedOptionForIcon(data.correct_option_value);
//           setUserResponceArray((prevArray) => [
//             ...prevArray,
//             {
//               question: questions?.[currentQuestionIndex]?.question,
//               givenAns: data.correct_option_value,
//               correctAns: data.correct_option_value,
//               isCorrect: data.is_correct,
//               time: Math.floor(Math.random() * (30 - 3 + 1)) + 3,
//             },
//           ]);
//           return;
//         } else if (!data.is_correct && !bool) {
//           setSelectedOption(data.wrong_option);
//           setSelectedOptionForIcon(data.wrong_option);
//           setUserResponceArray((prevArray) => [
//             ...prevArray,
//             {
//               question: questions?.[currentQuestionIndex]?.question,
//               givenAns: data.wrong_option,
//               correctAns: data.correct_option_value,
//               isCorrect: data.is_correct,
//               time: Math.floor(Math.random() * (30 - 3 + 1)) + 3,
//             },
//           ]);
//           return;
//         } else if (!data.is_correct && bool) {
//           setSelectedOption(data.wrong_option);
//           setUserResponceArray((prevArray) => [
//             ...prevArray,
//             {
//               question: questions?.[currentQuestionIndex]?.question,
//               givenAns: userAnswer,
//               correctAns: data.correct_option_value,
//               isCorrect: data.is_correct,
//               time: Math.floor(Math.random() * (30 - 3 + 1)) + 3,
//             },
//           ]);
//           return;
//         } else if (data.is_correct && bool) {
//           setSelectedOption(data.correct_option_value);
//           setUserResponceArray((prevArray) => [
//             ...prevArray,
//             {
//               question: questions?.[currentQuestionIndex]?.question,
//               givenAns: userAnswer,
//               correctAns: data.correct_option_value,
//               isCorrect: data.is_correct,
//               time: Math.floor(Math.random() * (30 - 3 + 1)) + 3,
//             },
//           ]);
//           return;
//         }
//       }, Math.max(0, minLoadingTime - elapsedTime));
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error validating answer:", error);
//     }
//   };

//   const handleRecordingComplete = async (recordingBlob) => {
//     try {
//       const base64Audio = await blobToBase64(recordingBlob); // Convert blob to base64
//       verifyAnswer(base64Audio, false);
//     } catch (err) {
//       console.error("Error processing the recording blob", err);
//     }
//   };

//   useEffect(() => {
//     if (recordingBlob) {
//       handleRecordingComplete(recordingBlob);
//     }
//   }, [recordingBlob]);

//   const handleOptionClick = (option) => {
//     if (isRecording || selectedOption) return;
//     if (audio) {
//       audio.pause();
//     }
//     setSelectedOptionForIcon(option);
//     verifyAnswer(option, true);
//   };

//   const pauseQuestionAudio = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     setIsPlaying(false);
//     // setAllowAudio(false); // Prevent auto-play on question change
//   };

//   const handleStartRecording = async (source) => {
//     if (isRecording) return;
//     pauseQuestionAudio();
//     if (selectedOption) return;
//     // const newAudio = new Audio("/music/startmic.wav");
//     // setAudio(newAudio);
//     // newAudio.play(); //

//     if (permissionState === "denied" && source === "audio") return;
//     if (permissionState === "denied" && source === "click") {
//       setErrorMessage("Please allow microphone in browser setting");
//       return;
//     }
//     startRecording();

//     // setTimeout(() => {
//     //   stopRecording();
//     // }, 4000); // Stops recording after 4 seconds
//   };
//   useEffect(() => {
//     if (recordingTime > 4) {
//       stopRecording();
//     }
//   }, [recordingTime]);

//   const handleStopRecording = () => {
//     return;
//   };

//   const currentQuestion = questions[currentQuestionIndex];
//   if (!currentQuestion) {
//     return <VerifyLoading />;
//   }

//   return (
//     <div
//       className={`pt7 pt-4 pb- min-h-svh max-w-md mx-auto grid  relative ${
//         ansType === "text" ? "grid-rows-[auto_1fr_auto_auto]" : ""
//       }`}
//     >
//       <section className="w-full fle grid flex-col gap-1.5 px-6">
//         <nav className=" w-full flex justify-between items-center ">
//           <div className="flex items-center gap-3 ">
//             <ArrowLeft size={24} />
//             <span className="text-dark-green font-semibold text-lg/5.5 ">
//               {currentQuestionIndex + 1}/{questions.length}
//             </span>
//           </div>

//           <div className="flex flex-col gap-2.5  ">
//             <span className="p-3  rounded-full bg-[#79BF44] outline-1 outline-dark-green">
//               <LogOut color="white" size={16} />
//             </span>

//             <span
//               // onClick={() => setIsMuted((prev) => !prev)}
//               onClick={toggleQuestionAudio}
//               className="p-3 rounded-full bg-[#79BF44] outline-1 outline-dark-green"
//             >
//               {!isPlaying ? (
//                 <VolumeOff color="white" size={16} />
//               ) : (
//                 <Volume2 color="white" size={16} />
//               )}
//             </span>
//           </div>
//         </nav>

//         <ProgressBar count={currentQuestion.question_id + 1} />
//       </section>

//       {/* ${ansType  ? "grid-rows-[minmax(auto,19%)_minmax(auto,25%)_minmax(auto,7%)] md:grid-rows-none" : ""
//       } */}
//       <section
//         className={`w-full fle flex-col grid gap-2 px-6
//                 ${ansType ? "grid-rows-[90px_120px_40px]" : ""}
//         `}
//       >
//         <div className="font-semibold text-base/5 tracking-wide text-[#111111] outline outline-black p-3.5 rounded-xl">
//           {`Q${currentQuestion.question_id + 1}.`} {currentQuestion.question}
//           {/* You're recommending Triple Protect to someone who catches flu often.
//           What do you highlight? */}
//         </div>

//         <span className="w-[42px]">
//           {!isLoading && (
//             <Timer
//               onTimeout={handleSkip}
//               seconds={seconds}
//               setSeconds={setSeconds}
//               index={currentQuestionIndex}
//               isQuizQuestionLoading={!currentQuestion}
//               autoSubmit={handleSubmit}
//             />
//           )}
//         </span>

//         <div className="relative  overflow-visible flex items-center justify-center cursor-pointer ">
//           <div
//             // onClick={() => setClicked(!clicked)}
//             onClick={isRecording ? handleStopRecording : handleStartRecording}
//             className="flex flex-col gap- justify-center items-center z-50 relative py-6 pt-5 "
//           >
//             <Image
//               className={`${isRecording ? "w-15" : ""}`}
//               width={41.5}
//               height={60}
//               alt="solid mic white"
//               src={isRecording ? "/gif/waves.gif" : "/images/mic.png"}
//               priority={true}
//             />
//             <span className="font-medium text-xs/4 text-center text-white ">
//               {isRecording ? "Listening" : "Tap to answer"}
//             </span>
//           </div>

//           <Image
//             className="absolute inset-0 z-0 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 "
//             width={110}
//             height={120}
//             alt="green hexagon"
//             src={"/images/green-hexagon.png"}
//             priority={true}
//           />
//         </div>

//         {currentQuestion?.is_write ? (
//           <div class=" py-2 px-3.5 w-full flex justify-left border-b border-black ">
//             <input
//               onChange={(e) => e.target.value}
//               type="text"
//               placeholder="Type your answer here"
//               class="font-medium w-full text-base/5.5 tracking-wide text-black111/65  bg-transparent text-left  focus:outline-none"
//             />
//           </div>
//         ) : (
//           // <Options />

//           <div className=" w-full flex flex-col gap-2">
//             {currentQuestion?.options?.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleOptionClick(option)}
//                 className={`text-[16px] leading-5 text-center flex items-center justify-between border border-[#28211D]  px-6 py-3 rounded-full capitalize xl:cursor-pointer hover:bg-[#703513]/10 font-semibold text-base/5 text-black111 tracking-wide w-full ${
//                   selectedOption?.trim().toLowerCase() ===
//                   option?.trim().toLowerCase()
//                     ? isAnswerCorrect
//                       ? "!border-[#066A37] !bg-[#00AE55] !text-white"
//                       : "!bg-[#F60000] !border-[#7F0000] !text-white"
//                     : ""
//                 }`}
//               >
//                 {option}

//                 {selectedOptionForIcon?.trim().toLowerCase() ===
//                   option?.trim().toLowerCase() &&
//                   isAnswerCorrect && (
//                     <Image
//                       src="/svg/tick-circle-solid.svg"
//                       width={24}
//                       height={24}
//                       alt="tick image"
//                       priority
//                     />
//                   )}
//               </button>
//             ))}
//           </div>
//         )}
//       </section>

//       <div className=" w-full flex items-center gap-5 mt-4 px-6">
//         <button
//           onClick={handleSkip}
//           disabled={isQuizCompleted}
//           className="shadow-[0px_2px_2px_#00993333] w-1/2 rounded-xl font-semibold text-xl/6 outline-2 outline-dark-green text-dark-green text-center py-3"
//         >
//           Skip
//         </button>

//         <button
//           onClick={handleSubmit}
//           disabled={isQuizCompleted}
//           className="shadow-[0px_2px_2px_#00993333] w-1/2 rounded-xl font-semibold text-xl/6 outline-2 outline-dark-green text-dark-green text-center py-3"
//         >
//           Submit
//         </button>
//       </div>

//       <Image
//         src={"/images/green-curves-graphic.png"}
//         className="w-full h-auto  bottom-0 left-0 right-0 "
//         width={375}
//         height={120}
//         alt="green graphics image abstract"
//         priority={true}
//       />
//     </div>
//   );
// };

// export default Quiz;

import Options from "@/components/Options";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";
import VerifyLoading from "@/components/VerifyLoading";
import {
  ArrowLeft,
  LogOut,
  Mic,
  SendHorizontal,
  Volume2,
  VolumeOff,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useVoiceRecorder from "@/hooks/useVoiceRecorder";
import { blobToBase64 } from "@/components/helper";
import Loading from "@/components/Loading";
import Link from "next/link";

const Quiz = () => {
  const {
    recordingBlob,
    isRecording,
    startRecording,
    stopRecording,
    permissionState,
    recordingTime,
  } = useVoiceRecorder();
  const [clicked, setClicked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [ansType, setAnsType] = useState("");
  const audioRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allowAudio, setAllowAudio] = useState(false); // Controls whether audio should play
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [correctOptionValue, setCorrectOptionValue] = useState(null);
  const [audio, setAudio] = useState(null);
  const searchParams = useSearchParams();
  const [userResponceArray, setUserResponceArray] = useState([]);
  const [animationNumber, setAnimationNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, SetName] = useState();

  const router = useRouter();
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    SetName(name);
    if (!name) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setAnimation(true);
      }, 500);
    }
  }, [isLoading]);

  //////////////////////////////////////////////////////////////////////////////////
  const language = searchParams.get("language") || "english";
  const session_id = searchParams.get("session") || "";

  useEffect(() => {
    if (router.isReady && !isQuizCompleted && name) {
      fetchQuestions();
    }
  }, [router.isReady, language, name, isQuizCompleted]);

  useEffect(() => {
    if (allowAudio) {
      playQuestionAudio();
    }
  }, [currentQuestionIndex]);

  const toggleQuestionAudio = () => {
    if (isPlaying) {
      stopQuestionAudio();
    } else {
      playQuestionAudio();
    }
  };

  const playQuestionAudio = () => {
    if (audio) {
      audio.pause();
    }
    setAllowAudio(true);
    const questionAudio = new Audio(
      `${questions[currentQuestionIndex]?.audio_path}`
    );

    questionAudio
      .play()
      .then(() => {
        setIsPlaying(true);
        setAudio(questionAudio);
      })
      .catch((error) => console.error("Audio play error:", error));

    questionAudio.onended = () => {
      setIsPlaying(false);
      if (selectedOption) return;
      handleStartRecording();
    };
  };

  const stopQuestionAudio = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    setAllowAudio(false); // Prevent auto-play on question change
  };

  const fetchQuestions = async () => {
    if (isQuizCompleted) return;

    try {
      const response = await fetch(
        `https://api.amway.thefirstimpression.ai/api/get_all_question?lang=${language}`
      );

      if (!response.ok) {
        throw new Error("Failed to load questions");
      }

      const data = await response.json();
      if (data?.quiz?.length > 0) {
        setQuestions(data.quiz);
      } else {
        setHasError(true);
        setErrorMessage(
          "Unable to load quiz questions. Please try again later."
        );
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage("Unable to load quiz questions. Please try again later.");
    }
  };

  const handleSkip = () => {
    if (isQuizCompleted) return;

    if (isRecording) return;
    if (audio) {
      audio.pause();
    }
    if (currentQuestionIndex < questions.length - 1) {
      setSeconds(30);
      resetState();
      setIsPlaying(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (isQuizCompleted) return;
    if (selectedOption) {
      if (audio) {
        audio.pause();
      }
      setSeconds(30);
      goToNextQuestion();
    }
  };

  const goToNextQuestion = () => {
    if (isQuizCompleted) return;

    resetState();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const insertRecord = async () => {
    try {
      setIsLoading(true);
      const name = sessionStorage.getItem("name");
      const response = await fetch(
        "https://api.amway.thefirstimpression.ai/api/insert_record",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            session_id,
            quiz: userResponceArray,
          }),
        }
      );

      await response.json();

      setTimeout(() => {
        router.push(`/leaderboard?session_id=${session_id}&name=${name}`);
      }, 150);
    } catch (error) {
      setIsLoading(false);
      console.error("Error inserting record:", error);
      setTimeout(() => {
        router.push("/leaderboard");
      }, 150);
    }
  };

  const completeQuiz = () => {
    setIsQuizCompleted(true);
    if (audio) audio.pause();
    insertRecord(); // no need for try/catch here anymore
  };
  const resetState = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setCorrectOption(null);
    setCorrectOptionValue(null);
  };

  const verifyAnswer = async (userAnswer, isClickedOption = false) => {
    if (!questions[currentQuestionIndex] || isQuizCompleted) return;
    if (seconds === 2) return;
    if (selectedOption) return; // Already answered

    const body = {
      user_answer: userAnswer,
      question_id: questions[currentQuestionIndex].question_id,
      lang: language,
      onClick: isClickedOption,
      platform: questions[currentQuestionIndex].question_id === 7 ? "" : "iOS",
      option_one: questions[currentQuestionIndex].options[0],
      is_write:
        questions[currentQuestionIndex].question_id === 7 ? true : false,
    };

    const startTime = Date.now();
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://api.amway.thefirstimpression.ai/api/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 800;

      setTimeout(() => {
        setIsLoading(false);

        // Play sound based on correct/incorrect
        if (data.is_correct) {
          const newAudio = new Audio("/music/rightAnswer.mp3");
          setAudio(newAudio);
          newAudio.play();
        } else {
          const newAudio = new Audio("/music/wrongAnswer.mp3");
          setAudio(newAudio);
          newAudio.play();
        }

        // Store verify result information
        setIsAnswerCorrect(data.is_correct);
        setCorrectOption(data.correct_option_key);
        setCorrectOptionValue(data.correct_option_value);

        // Set the user's selected option
        if (isClickedOption) {
          // User clicked an option - use exactly what was clicked
          setSelectedOption(userAnswer);
        } else {
          // Voice recording - use the API response
          setSelectedOption(
            data.is_correct ? data.correct_option_value : data.user_answer
          );
        }

        // Record user response for history
        setUserResponceArray((prevArray) => [
          ...prevArray,
          {
            question: questions?.[currentQuestionIndex]?.question,
            givenAns: userAnswer,
            correctAns: data.correct_option_value,
            isCorrect: data.is_correct,
            time: Math.floor(Math.random() * (30 - 3 + 1)) + 3,
          },
        ]);
      }, Math.max(0, minLoadingTime - elapsedTime));
    } catch (error) {
      setIsLoading(false);
      console.error("Error validating answer:", error);
    }
  };

  const handleRecordingComplete = async (recordingBlob) => {
    try {
      const base64Audio = await blobToBase64(recordingBlob); // Convert blob to base64
      verifyAnswer(base64Audio, false);
    } catch (err) {
      console.error("Error processing the recording blob", err);
    }
  };

  useEffect(() => {
    if (recordingBlob) {
      handleRecordingComplete(recordingBlob);
    }
  }, [recordingBlob]);

  const handleOptionClick = (option) => {
    if (isRecording || selectedOption) return;
    if (audio) {
      audio.pause();
    }
    verifyAnswer(option, true);
  };

  const pauseQuestionAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleStartRecording = async (source) => {
    if (isRecording) return;
    pauseQuestionAudio();
    if (selectedOption) return;

    if (permissionState === "denied" && source === "audio") return;
    if (permissionState === "denied" && source === "click") {
      setErrorMessage("Please allow microphone in browser setting");
      return;
    }
    startRecording();
  };

  useEffect(() => {
    if (recordingTime > 4) {
      stopRecording();
    }
  }, [recordingTime]);

  const handleStopRecording = () => {
    return;
  };

  const [query, setQuery] = useState("");
  // const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce effect
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedQuery(query);
  //   }, 500); // delay in ms

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [query]);

  // Triggered after debounce
  // useEffect(() => {
  //   if (debouncedQuery) {
  //     verifyAnswer(debouncedQuery, false);
  //   }
  // }, [debouncedQuery]);

  const currentQuestion = questions[currentQuestionIndex];
  if (!name) return null;
  if (!currentQuestion) {
    return <Loading />;
  }

  return (
    <div
      className={`pt-[3.5vh] pb-[15vh] h-svh sm:h-auto  max-w-md mx-auto grid  relative overflow-hidden ${
        ansType === "text" ? "grid-rows-[auto_1fr_auto_auto]" : ""
      }`}
    >
      <section className="w-full fle grid flex-col gap-1.5 px-6">
        <nav className=" w-full flex justify-between  relative ">
          <div
            className={`flex flex-col justify-between 
            transition-all duration-1000 ease-in-out ${
              animation ? "translate-x-0 " : "-translate-x-30"
            }
            `}
          >
            <div className="flex gap-3 self-start">
              <Link className="cursor-pointer" href={"/register"}>
                <ArrowLeft size={24} />
              </Link>

              <span className="text-dark-green font-semibold text-lg/5.5 ">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          <span className="absolute bottom-0 left-1/2 -translate-x-1/2  text-dark-green  font-inter font-semibold text-base">
            {!isLoading && (
              <Timer
                onTimeout={handleSkip}
                seconds={seconds}
                setSeconds={setSeconds}
                index={currentQuestionIndex}
                isQuizQuestionLoading={!currentQuestion}
                autoSubmit={handleSubmit}
              />
            )}
          </span>
          <div
            className={`flex flex-col gap-2.5
              transition-all duration-1000 ease-in-out ${
                animation ? "translate-x-0 " : "translate-x-30"
              }
            `}
          >
            <span className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-[#79BF44] outline-1 outline-dark-green">
              <Link className="cursor-pointer" href={"/"}>
                <LogOut color="white" size={16} />
              </Link>
            </span>

            <span
              onClick={toggleQuestionAudio}
              className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-[#79BF44] outline-1 outline-dark-green"
            >
              {!isPlaying ? (
                <VolumeOff color="white" size={16} />
              ) : (
                <Volume2 color="white" size={16} />
              )}
            </span>
          </div>
        </nav>

        <ProgressBar
          animation={animation}
          count={currentQuestion.question_id + 1}
        />
      </section>

      <section
        className={`w-full fle flex-col grid gap-2 px-6
        ${ansType ? "grid-rows-[90px_120px_40px]" : ""} 
        `}
      >
        <div className="font-semibold text-base/5 tracking-wide text-[#111111] relative outline outline-black p-3.5 rounded-xl">
          {`Q${currentQuestion.question_id + 1}.`} {currentQuestion.question}
          {/* <span className="absolute right-0 -bottom-5 bg-green-200 rounded-full p-2 w-16 text-center">
            {!isLoading && (
              <Timer
                onTimeout={handleSkip}
                seconds={seconds}
                setSeconds={setSeconds}
                index={currentQuestionIndex}
                isQuizQuestionLoading={!currentQuestion}
                autoSubmit={handleSubmit}
              />
            )}
          </span> */}
        </div>

        <div className="relative  overflow-visible flex items-center justify-center cursor-pointer ">
          <div
            onClick={
              isRecording
                ? handleStopRecording
                : () => handleStartRecording("click")
            }
            className="flex flex-col gap- justify-center items-center z-50 relative py-6 pt-5 "
          >
            <Image
              className={`${isRecording ? "w-15" : ""}`}
              width={41.5}
              height={60}
              alt="solid mic white"
              src={isRecording ? "/gif/waves.gif" : "/images/mic.png"}
              priority={true}
            />
            <span className="font-medium text-xs/4 text-center text-white ">
              {isRecording ? "Listening" : "Tap to answer"}
            </span>
          </div>

          <Image
            className="absolute inset-0 z-0 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 "
            width={110}
            height={120}
            alt="green hexagon"
            src={"/images/green-hexagon.png"}
            priority={true}
          />
        </div>

        {currentQuestion?.is_write ? (
          <div className="py-2 px-3.5 w-full flex justify-left items-center border-b border-black">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Type your answer here"
              className="font-medium w-full text-base/5.5 tracking-wide text-black111/65 bg-transparent text-left focus:outline-none"
            />

            {query && (
              <SendHorizontal
                onClick={() => verifyAnswer(query, false)}
                className="text-dark-green cursor-pointer"
                size={20}
              />
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {currentQuestion?.options?.map((option, index) => {
              // Is this the option the user selected?
              const isSelected =
                selectedOption?.trim().toLowerCase() ===
                option?.trim().toLowerCase();

              // Is this option the correct answer?
              const isCorrectOption =
                correctOptionValue?.trim().toLowerCase() ===
                option?.trim().toLowerCase();

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`
                    text-[16px] leading-5 text-center 
                    flex items-center justify-between 
                    border border-[#28211D] px-6 py-3 rounded-lg 
                    capitalize xl:cursor-pointer hover:bg-[#703513]/10 
                    font-semibold text-base/5 text-black111 tracking-wide w-full
                    ${
                      isSelected
                        ? isAnswerCorrect
                          ? "!border-[#066A37] !bg-dark-green !text-white" // User selected this and it's correct
                          : "!bg-[#ED0000] !border-[#ED0000] !text-white" // User selected this and it's wrong
                        : isCorrectOption && selectedOption && !isAnswerCorrect
                        ? "!border-[#066A37] !bg-dark-green !text-white" // This is the correct answer (shown after user selected wrong)
                        : ""
                    }
                  `}
                >
                  {option}

                  {/* Show checkmark if this option was selected and correct */}
                  {isSelected && isAnswerCorrect && (
                    <Image
                      src="/svg/tick-circle-solid.svg"
                      width={24}
                      height={24}
                      alt="tick image"
                      priority
                    />
                  )}

                  {/* Show X mark if this option was selected and incorrect */}
                  {/* {isSelected && !isAnswerCorrect && (
                    <Image
                      src="/svg/x-circle-solid.svg"
                      width={24}
                      height={24}
                      alt="x image"
                      priority
                    />
                  )} */}

                  {/* Show checkmark on the correct option if user selected wrong */}
                  {!isSelected &&
                    isCorrectOption &&
                    selectedOption &&
                    !isAnswerCorrect && (
                      <Image
                        src="/svg/tick-circle-solid.svg"
                        width={24}
                        height={24}
                        alt="correct answer indicator"
                        priority
                      />
                    )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <div className="w-full flex items-center gap-5 mt-4 px-6 relative z-50">
        <button
          onClick={handleSkip}
          disabled={isQuizCompleted}
          className="shadow-[0px_2px_2px_#00993333] w-1/2 rounded-xl font-semibold text-xl/6 outline-2 outline-dark-green text-dark-green text-center py-3"
        >
          Skip
        </button>

        <button
          onClick={handleSubmit}
          disabled={isQuizCompleted}
          className="shadow-[0px_2px_2px_#00993333] w-1/2 rounded-xl font-semibold text-xl/6 outline-2 outline-dark-green text-dark-green  active:bg-dark-green active:text-white text-center py-3"
        >
          Submit
        </button>
      </div>

      <Image
        src={"/images/green-curves-graphic.png"}
        className="w-full h-auto absolute z-0 bottom-0 left-0 "
        width={375}
        height={120}
        alt="green graphics image abstract"
        priority={true}
      />
      {isLoading && <VerifyLoading />}
    </div>
  );
};

export default Quiz;
