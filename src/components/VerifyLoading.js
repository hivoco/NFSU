import Image from "next/image";

function VerifyLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/90"></div>
      <div className="bg-white rounded-lg p-6 shadow-xl z-10 relative">
        <div className="flex flex-col justify-center items-center gap-30 sm:gap-10">
          <div className="relative">
            {/* <Image
              className="mx-auto w-36 h-auto animate-spin"
              src="/images/green-leaf-circle.png"
              
              width={280}
              height={265}
              alt="Loading animation"
            /> */}

            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#007B48]"></div>
            </div>
            <div className="flex items-center font-normal text-sm text-center text-black mt-2 tracking-wide">
              <span className="capitalize">Checking your answer</span>
              <span className="dot1">.</span>
              <span className="dot2">.</span>
              <span className="dot3">.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyLoading;
