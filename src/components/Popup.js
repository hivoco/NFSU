import React, { useEffect, useState } from "react";

const Popup = ({ children, bg, className }) => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      setAnimation(true);
    }, 200);
    return () => {
      setAnimation(false);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="absolute inset-0 blur-md "></div>
      <div
        className={`opacity-0 ${
          animation &&
          "transition-all duration-200 delay-100 ease-in opacity-100"
        } ${
          bg ? bg : "bg-white"
        } p-6 rounded-xl md:w-[350px] w-[90%] flex justify-center items-center relative ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
