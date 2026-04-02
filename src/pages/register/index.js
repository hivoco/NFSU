// import Header from "@/components/Header";
// import Layout from "@/components/Layout";
// import SelectLanguage from "@/components/SelectLanguage";
// import { Ban, CircleArrowRight, CircleCheck, X } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";

// const Register = () => {
//   const [isExit, setIsExit] = useState(null); // Set to null initially to represent "not checked yet"
//   const [continueClicked, setContinueClicked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [Name, setName] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   console.log(isExit, "isexit");

//   const verifyName = (Name) => {
//     if (!Name.trim()) {
//       setIsExit(null); // Reset when empty
//       return;
//     }

//     setIsLoading(true);
//     fetch(
//       `https://api.amway.thefirstimpression.ai/api/is_user_exit?name=${Name}`
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json(); // Return the promise for the next then
//       })
//       .then((data) => {
//         console.log("Success:", data);
//         setIsExit(data.is_user_exist);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setIsLoading(false);
//         setIsExit(null); // Reset on error
//       });
//   };

//   // Debounce effect
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedQuery(Name);
//     }, 500); // delay in ms

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [Name]);

//   // Triggered after debounce
//   useEffect(() => {
//     if (debouncedQuery) {
//       verifyName(debouncedQuery);
//     } else {
//       setIsExit(null); // Reset when input is empty
//     }
//   }, [debouncedQuery]);

//   const getStatusIcon = () => {
//     if (!Name.trim()) return null; // No icon if no input
//     if (isLoading)
//       return <span className="text-dark-green animate-pulse">...</span>; // Loading indicator
//     if (isExit === true)
//       return <X size={20} className="text-red-500" strokeWidth={1.5} />;
//     if (isExit === false)
//       return (
//         <CircleCheck
//           size={20}
//           className="text-white fill-dark-green"
//           strokeWidth={1.5}
//         />
//       );
//     return null; // No icon if not yet checked
//   };

//   const goFarword = (Name) => {
//     if (!isExit) {
//       sessionStorage.setItem("name", Name.trim());
//       if (isExit === null || isExit === true) return;
//       setContinueClicked(true);
//       setAnimation(false);
//     }
//   };

//   const [animation, setAnimation] = useState(false);
//   useEffect(() => {
//     setAnimation(true);
//   }, [continueClicked]);

//   return (
//     <Layout animation={animation}>
//       <div
//         className={`relative h-full w-full z-50 overflow-hidden
//         transition-all duration-1000 ease-in-out transform ${
//           animation ? "opacity-100" : "opacity-0 "
//         }
//         `}
//       >
//         <Header animation={animation} />

//         <div className="h-72/100 sm:h-2/3  fle flex-col justify-stretch px-12 grid grid-rows-[1fr_3.3fr_auto] gap-8 sm:gap-6 sm:w-4/5 sm:mx-auto">
//           <section
//             className={`flex w-full gap-2.5 items-center justify-center
//                       transition-all duration-1000 ease-in-out ${
//                         animation
//                           ? "translate-y-0 opacity-100"
//                           : "-translate-y-20 opacity-0"
//                       }
//             `}
//           >
//             <Image
//               alt="nutrilite-triple-protect"
//               width={67}
//               height={77}
//               src="/images/nutrilite-triple-protect.png"
//             />
//             <div className="font-extrabold text-3xl/9">
//               <h1 className=" text-[#79bf44]">Nutrilite</h1>
//               <h1 className=" text-dark-green">Triple Protect</h1>
//             </div>
//           </section>

//           {!continueClicked && (
//             <>
//               <section className="flex w-full flex-col gap-7 sm:gap-2">
//                 <div className="flex flex-col gap-2 items-center">
//                   <Image
//                     alt="plant icon"
//                     width={90}
//                     height={70}
//                     src={"/images/plant-icon.png"}
//                   />
//                   <h1
//                     className={`text-dark-green font-bold text-2xl/7
//                               transition-all duration-1000 ease-in-out ${
//                                 animation
//                                   ? "translate-y-0 opacity-100"
//                                   : "translate-y-7 opacity-0"
//                               }
//                     `}
//                   >
//                     User Registration
//                   </h1>
//                 </div>

//                 <div className="w-full flex flex-col gap-1 justify-center">
//                   <input
//                     type="text"
//                     enterKeyHint="enter"
//                     inputMode="text"
//                     placeholder="Enter your name"
//                     className="font-medium text-sm/6 align-middle text-black capitalize placeholder:text-[#8B8B8B] py-3.5 px-5 outline-3 outline-dark-green rounded-full"
//                     value={Name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                   {Name.trim() && (
//                     <label
//                       className={`font-medium flex items-center gap-1 text-sm/4 text-left px-5 ${
//                         isExit === null
//                           ? "text-gray-400"
//                           : isExit === false
//                           ? "text-dark-green"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {isExit === false
//                         ? "Username available"
//                         : isExit === true
//                         ? "Username already exists"
//                         : "Checking availability..."}
//                       {getStatusIcon()}
//                     </label>
//                   )}
//                 </div>
//               </section>

//               <div
//                 onClick={() => goFarword(Name)}
//                 className={`py-3.5 px-5 outline-dark-green rounded-full font-bold text-xl/6.5 text-center cursor-pointer
//                 ${
//                   Name.trim() && isExit === false
//                     ? "text-white bg-dark-green outline-0 shadow-[0px_2px_2px_#00993333]"
//                     : "text-dark-green bg-white/60 outline-2 opacity-70 cursor-not-allowed"
//                 }
//                 transition-all duration-1000 ease-in-out ${
//                   animation
//                     ? "translate-y-0 opacity-100"
//                     : "translate-y-50 opacity-0"
//                 }
//                 `}
//               >
//                 Continue
//               </div>
//             </>
//           )}

//           {continueClicked && (
//             <SelectLanguage animation={animation} setAnimation={setAnimation} />
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Register;


import Header from "@/components/Header";
import Layout from "@/components/Layout";
import SelectLanguage from "@/components/SelectLanguage";
import SplashScreen from "@/components/SplashScreen";
import { CircleCheck, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const App = () => {
  const [displaySplash, setDisplaySplash] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);

  const [isExit, setIsExit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Name, setName] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setTimeout(() => setDisplaySplash(false), 3000);
  }, []);

  useEffect(() => {
    if (!displaySplash) {
      setTimeout(() => setAnimation(true), 100);
    }
  }, [displaySplash]);

  const verifyName = (Name) => {
    if (!Name.trim()) {
      setIsExit(null);
      return;
    }

    setIsLoading(true);
    fetch(`/api/is_user_exit?name=${Name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setIsExit(data.is_user_exist);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setIsExit(null);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(Name);
    }, 500);
    return () => clearTimeout(handler);
  }, [Name]);

  useEffect(() => {
    if (debouncedQuery) {
      verifyName(debouncedQuery);
    } else {
      setIsExit(null);
    }
  }, [debouncedQuery]);

  const getStatusIcon = () => {
    if (!Name.trim()) return null;
    if (isLoading) return <span className="text-dark-green animate-pulse">...</span>;
    if (isExit === true) return <X size={20} className="text-red-500" strokeWidth={1.5} />;
    if (isExit === false)
      return <CircleCheck size={20} className="text-white fill-dark-green" strokeWidth={1.5} />;
    return null;
  };

  const goFarword = () => {
    if (isExit === false && Name.trim()) {
      sessionStorage.setItem("name", Name.trim());
      setContinueClicked(true);
    }
  };

  const handleArrowClick = () => {
    setShowRegister(true);
  };

  if (displaySplash) {
    return (
      <Layout diffTopImage={true} animation={false}>
        <SplashScreen />
      </Layout>
    );
  }

  return (
    <Layout animation={animation}>
      <div className="relative h-full w-full z-50 overflow-hidden">
        {!continueClicked ? (
          <>
            <div
              className={`flex items-center justify-center gap-3 pt-[11vh] pb-[5vh] overflow-hidden
                transition-all duration-1000 ease-in-out ${animation ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
                }
              `}
            >
              {/* <Image
                src={"/logos/Nutrilite-logo.png"}
                width={217}
                height={44}
                alt="nutrilite logo"
                priority={true}
              /> */}
            </div>

            <div className="px-12 sm:w-4/5 sm:mx-auto">
              <Image
                className={`mx-auto w-auto transition-all duration-700 ease-in-out ${showRegister ? "h-[20vh] -translate-y-4" : "h-[43vh]"
                  } ${animation ? "translate-y-0 opacity-100" : "translate-y-30 opacity-0"}`}
                alt="nfsu"
                width={300}
                height={346}
                src="/images/image.png"
                priority={true}
                quality={100}
              />

              {!showRegister && (
                <button
                  onClick={handleArrowClick}
                  className={`w-full flex justify-center transition-all duration-1000 ease-in-out ${animation ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    }`}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="border-2 border-[#007B48] rounded-sm text-[#007B48] mt-[4vh] cursor-pointer hover:bg-[#007B48] hover:text-white transition-colors"
                  >
                    <path
                      d="M16 32H48M48 32L40 24M48 32L40 40"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              {showRegister && (
                <section
                  className={`flex w-full flex-col gap-7 sm:gap-2 mt-6 transition-all duration-700 delay-200 ease-in-out ${showRegister ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                >
                  <div className="flex flex-col gap-2 items-center">

                    <h1 className=" font-bold text-xl/7 text-[#007B48]">User Registration</h1>
                  </div>

                  <div className="w-full flex flex-col gap-1 justify-center">
                    <input
                      type="text"
                      enterKeyHint="enter"
                      inputMode="text"
                      placeholder="Enter your name"
                      className="font-medium text-sm/6 text-center align-middle text-[#007B48] capitalize  py-3.5 px-5   rounded-sm outline-1 outline-[#007B48]"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {Name.trim() && (
                      <label
                        className={`font-medium flex items-center gap-1 text-sm/4 text-left px-5 ${isExit === null
                            ? "text-gray-400"
                            : isExit === false
                              ? "text-dark-green"
                              : "text-red-500"
                          }`}
                      >
                        {isExit === false
                          ? "Username available"
                          : isExit === true
                            ? "Username already exists"
                            : "Checking availability..."}
                        {getStatusIcon()}
                      </label>
                    )}
                  </div>

                  <div
                    onClick={goFarword}
                    className={`py-3 px-3 rounded-sm font-bold text-xl/6.5 text-center cursor-pointer transition-all
                      ${Name.trim() && isExit === false
                        ? "text-[#007B48]  outline-0 "
                        : "text-[#007B48]   opacity-70 cursor-not-allowed"
                      }
                    `}
                  >
                    Continue
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          <div className="h-full">
            <Header animation={animation} />
            <div className="h-72/100 sm:h-2/3 px-12 grid grid-rows-[1fr_3.3fr_auto] gap-8 sm:gap-6 sm:w-4/5 sm:mx-auto">
              <section
                className={`flex w-full gap-2.5 items-center justify-center transition-all duration-1000 ease-in-out ${animation ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
                  }`}
              >
                <Image
                  alt="nfsu"
                  width={100}
                  height={100}
                  src="/images/image.png"
                />
              </section>

              <SelectLanguage animation={animation} setAnimation={setAnimation} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
