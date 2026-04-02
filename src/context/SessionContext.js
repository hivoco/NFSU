import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";

// Create a context to store and share the session info
const SessionContext = createContext({
  sessionName: null,
  setSessionName: () => {},
});

// Create a global router instance that auto-appends session
let globalSessionName = null;

export const SessionProvider = ({ children }) => {
  const router = useRouter();
  const [sessionName, setSessionName] = useState(null);

  // Function to update the global session name
  const updateSessionName = (name) => {
    setSessionName(name);
    globalSessionName = name;
  };

  // Check for session parameter on initial load and route changes
  useEffect(() => {
    // Handle route changes to extract session
    const handleRouteChange = (url) => {
      const urlObj = new URL(url, window.location.origin);
      const sessionParam = urlObj.searchParams.get("session");

      if (sessionParam && sessionParam !== sessionName) {
        updateSessionName(sessionParam);
      }
    };

    // Listen for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Initial setup: check URL for session param
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const initialSession = urlParams.get("session");

      if (initialSession) {
        updateSessionName(initialSession);
      }
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, sessionName]);

  // Override Next.js router methods to auto-append session
  useEffect(() => {
    if (!sessionName) return;

    // Store original methods
    const originalPush = router.push;
    const originalReplace = router.replace;

    // Override push method
    router.push = (url, as, options) => {
      return customNavigate(url, as, options, originalPush);
    };

    // Override replace method
    router.replace = (url, as, options) => {
      return customNavigate(url, as, options, originalReplace);
    };

    function customNavigate(url, as, options, navigateMethod) {
      if (!url) return Promise.resolve(true);

      // Handle string URLs
      if (typeof url === "string") {
        url = appendSessionToUrl(url, sessionName);

        if (typeof as === "string") {
          as = appendSessionToUrl(as, sessionName);
        }
      }
      // Handle URL object
      else if (typeof url === "object" && url !== null) {
        // Create a copy of the query object to avoid mutating the original
        const query = { ...(url.query || {}) };

        // Add session to query if not already present
        if (!query.session) {
          query.session = sessionName;
        }

        // Create a new object with the updated query
        url = {
          ...url,
          query,
        };

        // Handle 'as' if it's a string
        if (typeof as === "string") {
          as = appendSessionToUrl(as, sessionName);
        }
      }

      return navigateMethod.call(router, url, as, options);
    }

    // Cleanup
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router, sessionName]);

  return (
    <SessionContext.Provider
      value={{ sessionName, setSessionName: updateSessionName }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Function to append session to any URL
export function appendSessionToUrl(url, sessionName) {
  if (!sessionName) return url;
  if (!url) return url;

  try {
    // Check if URL is relative or absolute
    const isRelative = !url.match(/^https?:\/\//) && !url.match(/^\/\//);
    const baseUrl = isRelative ? window.location.origin : "";
    const urlObj = new URL(url, baseUrl);

    // Add session parameter if not already present
    if (!urlObj.searchParams.has("session")) {
      urlObj.searchParams.set("session", sessionName);
    }

    // Return just the pathname + search if it was a relative URL
    return isRelative
      ? `${urlObj.pathname}${urlObj.search}${urlObj.hash}`
      : urlObj.toString();
  } catch (e) {
    console.error("Error appending session to URL:", e);
    return url;
  }
}

// Custom hook to use the session context
export const useSession = () => useContext(SessionContext);

// Custom Link component that automatically adds session parameter
export  const SessionLink = ({ href, children, ...props }) => {
  const { sessionName } = useSession();
  let sessionHref = href;

  if (sessionName) {
    sessionHref = appendSessionToUrl(href, sessionName);
  }

  return (
    <Link href={sessionHref} {...props}>
      {children}
    </Link>
  );
};

// Global helper to get a URL with session
export  function getSessionUrl(url) {
  return appendSessionToUrl(url, globalSessionName);
}
