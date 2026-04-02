



import Layout from "@/components/Layout";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Result() {
  const router = useRouter();
  const score = Number(router.query.score) || 0;
  const total = Number(router.query.total) || 10;
  const session = router.query.session || "";
  const name = router.query.name || "";
  const passThreshold = Math.ceil(total * 0.7);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout bgImage="/images/bg-quiz.png">
      <div
        className={`bg-[url("/main-bg.png")] bg-no-repeat bg-cover bg-center  h-svh mx-auto flex flex-col p-7 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col w-full">
            {/* Logo - slides from 100px to actual position */}
            <div
              className={`mx-auto w-fit pt-10 transform transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0" : "-translate-y-[100px]"
                }`}
            >
              <Image src={"/images/image.png"} alt="Logo" width={100} height={100} />
            </div>

            <div className="relative flex justify-center items-center flex-col gap-10 w-full flex-1">
              {/* Trophy/Over Image - scales up */}
              <div
                className={`transform transition-all duration-1000 ease-out delay-300 ${isLoaded ? "scale-100" : "scale-0"
                  }`}
              >
                {/* <Image
                  className="object-contain"
                  src={score >= passThreshold ? "/images/trophy.png" : "/images/over.png"}
                  alt="Result"
                  width={score >= passThreshold ? 130 : 184}
                  height={score >= passThreshold ? 150 : 152}
                /> */}
               {
                score < passThreshold &&  <Image
                  className="object-contain absolute -top-5 right-0 "
                  src={"/images/question.png"}
                  alt="Result"
                  width={80}
                  height={80}
                />
               }
              </div>

              {/* Result Card - slides up from bottom */}
              <div
                className={`rounded-2xl p-7 w-full border border-[#007B481A] backdrop-blur-sm shadow-sm text-center transform transition-all  text-[#007B48] duration-1000 ease-out delay-500 bg-[#007B481A] ${isLoaded ? "translate-y-0" : "translate-y-[100px]"
                  }`}
              >
                <h2 className="text-6xl quantico-bold">{score}/{total}</h2>
                <h4 className="text-2xl quantico-bold mt-2">
                  {score >= passThreshold ? "CONGRATULATIONS!" : "Not quite there yet!"}
                </h4>
                <p className="quantico-regular text-base mt-1">
                  {score >= passThreshold
                    ? "You passed the quiz — great job."
                    : "Try again to pass the quiz"}
                </p>
              </div>
            </div>
          </div>

          {/* Button - slides up from bottom */}
          <div
            className={`flex flex-col gap-6 transform transition-all duration-1000 ease-out delay-700 ${isLoaded ? "translate-y-0" : "translate-y-[100px]"
              }`}
          >
            {session && (
              <button
                onClick={() => router.push(`/leaderboard?session=${session}&name=${encodeURIComponent(name)}`)}
                className="w-full rounded-lg font-medium text-xl/6 text-white text-center py-3 transition-all bg-[#007B48]"
              >
                View Leaderboard
              </button>
            )}

            {score < passThreshold && (
              <button
                onClick={() => router.push(session ? `/?session=${session}` : "/")}
                className="w-full rounded-lg border border-[#007B48] font-medium text-xl/6 text-[#007B48] text-center py-3 transition-all backdrop-blur-sm bg-[#007B4814]"
              >
                Play Again
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Result;
