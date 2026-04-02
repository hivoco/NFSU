const ProgressBar = ({ count, animation, totalSteps = 10 }) => {

  return (
    <div
      className={`flex w-full items-center justify-between relative py-1.5 mb-2
      transition-all duration-700 ease-in-out ${
        animation ? "translate-x-0 blur-none" : "-translate-y-15 blur-xs"
      }
        `}
    >
      {/* Line connecting all dots at the back-ground */}
      <div className="absolute h-1 bg-[#BFBFBF] left-0 right-0 top-1/2 transform -translate-y-1/2 z-0">
        <div
          style={{ width: `${count <= totalSteps ? ((count - 1) / (totalSteps - 1)) * 100 : 100}%` }}
          className="!bg-transparent h-full"
        />
      </div>

      {/* Dots 10 */}
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full z-10 transition-all duration-300 ease-out flex items-center justify-center
                ${index + 1 <= count ? "bg-[#007B48]" : "bg-[#BFBFBF]"}`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
