import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Router from "next/router";

const LeaderBoard = () => {
  const searchParams = useSearchParams();
  const [leaderboardList, setLeaderboardList] = useState([
    // { rank: "2nd", name: "Vidhaan", score: 96 },
    // { rank: "3rd", name: "Vinay", score: 92 },
    // { rank: "4th", name: "Adya", score: 89 },
    // { rank: "5th", name: "Shruti", score: 88 },
  ])
  const [animation, setAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const session_id = searchParams.get("session") ||"";
  const name = searchParams.get("name") || "";
  const router =useRouter()

  useEffect(() => {
    setAnimation(true);
  }, []);


  const getInfo = () => {
    setIsLoading(true);
    fetch(
      `/api/get_top5?session_id=${session_id}&name=${name}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Return the promise for the next then
      })
      .then((data) => {
        console.log("Success:", data);

        setIsLoading(false);
        setLeaderboardList(data?.top_5);
        // setLeaderboardList(data?.top_5?.slice(1));
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        // setIsRoomExists(null); // Reset on error
      });
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (session_id || name) {
      getInfo();
    }

    if (!session_id && !name) {
      router.replace("/");
    }
  }, [name, session_id, router.isReady]);

  if (!session_id && !name) {
    return null;
  }
  
  if (isLoading) {
    <Loading />;
  }
  return (
      <Layout animation={animation} bgImage="/images/bg-quiz.png" className={"sm:h-[110vh] pb-[vh]"}>
        <section
          className={`flex w-full  gap-2.5 items-center justify-center pt16 pb7 pt-[8vh] pb-[3.5vh]
        transition-all duration-1000 ease-in-out ${
          animation ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }
        `}
        >
          {/* <Image
            alt="nutrilite-triple-protect"
            width={67}
            height={77}
            src="/images/nutrilite-triple-protect.png"
            priority={true}
          /> */}
          <div className="font-extrabold text-3xl/9 ">
             <Image src={"/images/image.png"} alt="Logo" width={70} height={70} />
          </div>
        </section>

        {/* <div className="flex flex-col gap-6"> */}
        <section className="flex flex-col">
          <h1
            className={`text-[32px]/9 w-87/100 mx-auto tracking-wider text-center uppercase text-[#F9FBEA]
          shadow-[5px_5px_0px_#BDD83C] bg-dark-green py-1.5 rounded-lg
          transition-all duration-700 ease-in-out ${
            animation ? "scale-100" : "scale-50"
          }
      `}
          >
            LEADERBOARD
          </h1>

          <div className="flex items-center justify-between w-3/4 max-w-4/5 mx-auto">
            <h2
              className={`text-dark-green text-shadow-[0px_2px_2px_#00A55C26] font-bold text-[32px]/9
            transition-all duration-700 ease-in-out ${
              animation ? "translate-0" : "translate-y-10"
            }
            `}
            >
              1st
            </h2>

            <Image
              className={` h-[20.5vh] w-auto
            transition-all duration-700 ease-in-out mt-2 ${
              animation ? "scale-100" : "scale-50"
            }
              `}
              alt="prize with glare in bg"
              width={150}
              height={150}
              src="/images/trophy.png"
              quality={100}
              priority={true}
            />

            <h2
              className={`text-dark-green text-shadow-[0px_2px_2px_#00A55C26] font-bold text-[32px]/9
            transition-all duration-700 ease-in-out ${
              animation ? "translate-0" : "translate-y-10"
            }
            `}
            >
              {leaderboardList[0]?.score}
              <br />
              pts.
            </h2>
          </div>

          <h2
            className={`text-dark-green mt2.5  text-shadow-[0px_2px_2px_#00A55C26] font-bold text-[32px]/9 text-center
          transition-all duration-700 ease-in-out ${
            animation ? "translate-0" : "translate-y-10"
          }
          `}
          >
            {leaderboardList[0]?.name}
          </h2>
        </section>

        <section className="h-1/3 sm:w-95/100 sm:mx-auto px-6 fle flex-col grid gap-2 grid-rows-4 font-medium pt-6 relative z-50">
          {leaderboardList?.map((el, i) => (
            <div
              style={{
                transitionDelay: `${300 * i}ms`,
                transform: !animation
                  ? `translateY(${3 * i}rem)`
                  : "translateY(0)",
              }}
              key={el?.rank}
              className={`outline-2  outline-dark-green rounded-full py-4 px-5 text-lg/5.5 text-center text-black111
            flex items-center justify-between
            transition-all duration-700 ease-in-out ${
              animation ? "translate-0 opacity-100" : "translate-y-10 opacity-0"
            }
            `}
            >
              <div className="flex items-center gap-4">
                <span>{el?.rank}</span>
                <span>{el?.name}</span>
              </div>

              <span className="capitalize">Pts.{el?.score}</span>
            </div>
          ))}
        </section>
        {/* </div> */}
      </Layout>
  );
};

export default LeaderBoard;
