import { useState, useEffect } from "react";

const Timer = ({
  onTimeout,
  seconds,
  setSeconds,
  index,
  isQuizQuestionLoading,
  autoSubmit,
}) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0.0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds === 0 && index < 9 && !isQuizQuestionLoading) {
      onTimeout();
    } else if (seconds === 0 && index === 9) {
      autoSubmit();
    }
  }, [seconds, isQuizQuestionLoading]);

  return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export default Timer;
