import { CircleArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SelectLanguage = ({animation}) => {
 
  const languages = ["hindi", "english"];
  const [selectedLanguage, setSelectedLanguage] = useState("");
 
  return (
    <>
      <div className="w-full space-y-6">
        <h2 className="font-bold text-2xl/7.5 text-center text-dark-green">
          Choose Language
        </h2>

        {languages.map((l) => {
          return (
            <Image
              onClick={() => setSelectedLanguage(l.toLowerCase())}
              src={
                selectedLanguage === l.toLowerCase()
                  ? `/images/selected-option-${l}.png`
                  : `/images/unselected-option-${l}.png`
              }
              key={l}
              width={300}
              height={80}
              className={`w-full h-auto
                transition-all duration-1000 ease-in-out ${
                  animation
                    ? "translate-y-0 opacity-100"
                    : "translate-y-50 opacity-0"
                }
                `}
              alt="language"
            />
          );
        })}


      </div>

      <Link
        href={
          selectedLanguage ? `/quiz?language=${selectedLanguage}` : "#"
        }
      >
        <CircleArrowRight
          size={54}
          strokeWidth={1}
          className={`bg-white text-dark-green mx-auto
          transition-all duration-1000 ease-in-out ${
            animation
              ? "translate-y-0 opacity-100"
              : "translate-y-50 opacity-0"
          }
            `}
        />
      </Link>
    </>
  );
};

export default SelectLanguage;
