import { useState } from "react";

const Options = () => {
const [selected, setSelected] = useState();
  const optionLables = (index) => {
    const value = index + 1;
    switch (value) {
      case 1:
        return "A";
      case 2:
        return "B";
      case 3:
        return "C";
      case 4:
        return "D";
    }
  };
  const options = ["Coffee", "Tea", "Juice", "Water"];

  return (
    <div className=" w-full flex flex-col gap-1">
      {options.map((o, i) => (
        <div
          key={i}
          onClick={() => {
            setSelected(i);
          }}
          className={`font-semibold text-base/5 text-black111 tracking-wide w-full `}
        >
          <button
            className={`w-full outline-1 outline-black p-3.5 rounded-xl text-left
            ${selected === i ? "bg-dark-green text-white" : ""}`}
          >
            {optionLables(i)}.{o}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Options;
