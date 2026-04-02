import React, { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "./Layout";
import Header from "./Header";

const Loading = () => {
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <div
      className={`relative w-full h-svh
    `}
    >
      <Layout animation={animation} diffTopImage={false}>
        <>
          <Header />
          <div className="absolute top-1/2 -translate-y-1/2 w-full  flex  flex-col  gap-30 sm:gap-10">
            {/* <div className="relative"> */}
            {/* <Image
                className={`mx-auto w-3/4 sm:w-3/5 h-auto
               transition-transform duration-500  ${
                 animation ? "animate-spin" : ""
               }`}
                src="/images/green-leaf-circle.png"
                width={280}
                height={265}
                alt="loading animation"
                priority={true}
              /> */}

            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#007B48]"></div>
            </div>
            <span
              className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
        font-bold text-2xl/7 text-center text-[#007B48]
        "
            >
              Loading Quiz
            </span>
            {/* </div> */}

            <div className="text-black111 font-normal text-sm/4 text-center">
              <p>Answer questions correctly in the shortest</p>
              <p>
                timespan to improve your chances of winning.{" "}
                <span className="animate-ping text-black">...</span>{" "}
              </p>
            </div>
          </div>
        </>
      </Layout>
    </div>
  );
};

export default Loading;
