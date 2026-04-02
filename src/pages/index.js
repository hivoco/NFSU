

import Layout from "@/components/Layout";
import SplashScreen from "@/components/SplashScreen";
import { CircleCheck, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displaySplash, setDisplaySplash] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [Name, setName] = useState("");

  // Name uniqueness (only used when session exists)
  const [isExit, setIsExit] = useState(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [debouncedName, setDebouncedName] = useState("");

  const sessionId = searchParams.get("session") || "";
  const hasSession = !!sessionId;

  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem("session", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    setTimeout(() => setDisplaySplash(false), 3000);
  }, []);

  useEffect(() => {
    if (!displaySplash) {
      setTimeout(() => setAnimation(true), 100);
    }
  }, [displaySplash]);

  // Debounce name input for uniqueness check
  useEffect(() => {
    if (!hasSession) return;
    const handler = setTimeout(() => setDebouncedName(Name), 500);
    return () => clearTimeout(handler);
  }, [Name, hasSession]);

  // Check name uniqueness within session
  useEffect(() => {
    if (!hasSession) return;
    if (!debouncedName.trim()) {
      setIsExit(null);
      return;
    }
    setIsCheckingName(true);
    fetch(`/api/is_user_exit?name=${encodeURIComponent(debouncedName.trim())}&session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        setIsExit(data.is_user_exist);
        setIsCheckingName(false);
      })
      .catch(() => {
        setIsCheckingName(false);
        setIsExit(null);
      });
  }, [debouncedName, hasSession, sessionId]);

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Can continue: if session, name must be available; if no session, just need a name
  const canContinue = hasSession
    ? Name.trim() && isExit === false
    : !!Name.trim();

  const goForward = () => {
    if (!canContinue) return;
    sessionStorage.setItem("name", Name.trim());
    const newUserId = generateUserId();
    sessionStorage.setItem("userId", newUserId);
    router.push(`/quiz?language=english&user_id=${newUserId}&session=${sessionId}`);
  };

  const handleArrowClick = () => {
    setShowRegister(true);
  };

  const getStatusIcon = () => {
    if (!Name.trim() || !hasSession) return null;
    if (isCheckingName) return <span className="text-[#007B48] animate-pulse">...</span>;
    if (isExit === true) return <X size={20} className="text-red-500" strokeWidth={1.5} />;
    if (isExit === false) return <CircleCheck size={20} className="text-white fill-[#007B48]" strokeWidth={1.5} />;
    return null;
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
                <h1 className="font-bold text-xl/7 text-[#007B48] text-center">User Registration</h1>
              </div>

              <div className="w-full flex flex-col gap-1 justify-center">
                <input
                  type="text"
                  enterKeyHint="enter"
                  inputMode="text"
                  placeholder=" Your name"
                  className="font-medium text-sm/6 text-center align-middle text-[#007B48] capitalize py-3.5 px-5 rounded-sm outline-1 outline-[#007B48] bg-[#007B4814]"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && goForward()}
                />
                {hasSession && Name.trim() && (
                  <label
                    className={`font-medium flex items-center gap-1 text-sm/4 text-left px-5 ${
                      isExit === null
                        ? "text-gray-400"
                        : isExit === false
                        ? "text-[#007B48]"
                        : "text-red-500"
                    }`}
                  >
                    {isExit === false
                      ? "Username available"
                      : isExit === true
                      ? "Username already taken in this session"
                      : "Checking availability..."}
                    {getStatusIcon()}
                  </label>
                )}
              </div>

              <button
                onClick={goForward}
                disabled={!canContinue}
                className={`py-3 px-3 rounded-2xl font-bold text-xl/6.5 text-center cursor-pointer transition-all mt-10
                  ${canContinue
                    ? "text-white bg-[#007B48]"
                    : "text-white opacity-50 bg-[#007B48] cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </section>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default App;

