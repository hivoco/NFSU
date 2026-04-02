import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const PlatformQuiz = () => {
  const router = useRouter();
    const searchParams = useSearchParams();
    const language = searchParams.get("language");
    const session_id = searchParams.get("session") || "";

  useEffect(() => {
    if (typeof window !== "undefined" ) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      let platform = "android"; // Default platform

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        platform = "iOS"; // Detect iOS
      }

      console.log(platform,"platform");
      
      // Redirect based on platform
      if (platform == "iOS") {
        console.log(language,platform,"ios");
        
        router.push(`/iosquiz?language=${language}&session=${session_id}`); // Redirect to iOS quiz        
      } else {
        console.log(language,platform,"android");

        router.push(`/quiz?language=${language}&session=${session_id}`); // Redirect to Android quiz
      }
    }
  }, [router]);

  return <p>Detecting platform & redirecting...</p>; // Show while redirecting
};

export default PlatformQuiz;