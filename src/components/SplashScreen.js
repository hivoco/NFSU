import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);
  return (
    <div className="h-svh w-full  flex flex-col justify-center items-center relative overflow-hidden">
      {/* <Image
        className={`absolute top-0 sm:-top-28 w-full h-auto z-0
          transition-all duration-1000 ease-in-out ${animation
            ? "translate-x-0 translate-y-0 opacity-100"
            : "-translate-x-full translate-y-60 opacity-0"
          }
          `}
        src={"/images/leaves.png"}
        width={267}
        height={54}
        alt="nutrilite logo"
        priority={true}
      /> */}

      <section className="flex  flex-col justify-center items-center   relative z-50">
        {/* <Image
          className={`h-auto self-start pb-[5vh]
            transition-all duration-1000 ease-in-out ${animation
              ? " translate-y-0 opacity-100"
              : "-translate-y-30 opacity-0"
            }
            `}
          src={"/images/green-dots.png"}
          width={80}
          height={18}
          alt="green dots image"
          priority={true}
        /> */}

        <div className="h-full  space-y-1.5">
          {/* <Image
            className={`w-auto 
            transition-all duration-1000 ease-in-out ${animation
                ? " translate-y-0 opacity-100"
                : "-translate-y-30 opacity-0"
              }
            `}
            src={"/logos/Nutrilite-logo.png"}
            width={267}
            height={54}
            alt="nutrilite logo"
            priority={true}
          /> */}

          <X
            className={`mx-auto
            transition-all duration-1000 ease-in-out ${animation
                ? "opacity-100"
                : "opacity-0"
              }
            `}
          />

          <Image
            className={`w-auto
            transition-all duration-1000 ease-in-out ${animation
                ? " translate-y-0 opacity-100"
                : "translate-y-30 opacity-0"
              }
              `}
            src={"/logos/hivoco-color-logo-black-text.png"}
            width={267}
            height={45}
            alt="hivoco company logo"
            priority={true}
          />
        </div>

        {/* <Image
          className={`self-end h-auto pt-[5vh]
          transition-all duration-1000 ease-in-out ${animation
              ? " translate-y-0 opacity-100"
              : "translate-y-30 opacity-0"
            }
            `}
          src={"/images/green-dots.png"}
          width={80}
          height={18}
          alt="green dots image"
          priority={true}
        /> */}
      </section>


      {/* <Image
        className={`absolute bottom-0 sm:-bottom-32 rotate-180 w-full h-auto z-0 
        transition-all duration-1000 ease-in-out ${animation
            ? "translate-x-0 translate-y-0 opacity-100"
            : "translate-x-full -translate-y-60 opacity-0"
          }
        `}
        src={"/images/leaves.png"}
        width={267}
        height={54}
        alt="nutrilite logo"
        priority={true}
      /> */}
    </div>
  );
};

export default SplashScreen;
