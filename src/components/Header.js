import Image from "next/image";
const Header = ({ className,animation }) => {
  return (
    <header
      className={`w-full flex justify-between items-center px-5 !py-12 ${className}`}
    >
      {/* <Image
        className={`h-5 w-auto
        transition-all duration-1000 ease-in-out ${
          animation ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }
          `}
        src={"/logos/Nutrilite-logo.png"}
        width={99}
        height={20}
        alt="nutrilite logo"
        priority={true}
      /> */}

      <Image
        className={`h-5 w-auto
      transition-all duration-1000 ease-in-out ${
        animation ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }
        `}
        src={"/logos/hivoco-color-logo-black-text.png"}
        width={123}
        height={20}
        alt="hivoco logo"
        priority={true}
      />
    </header>
  );
};

export default Header;
