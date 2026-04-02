import React, { useEffect, useState } from "react";
import { CircleCheck, Copy, X } from "lucide-react";
import Image from "next/image";

const RoomCreator = () => {
  const [isRoomExists, setIsRoomExists] = useState(null); // Set to null initially to represent "not checked yet"
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);

  const verifyRoomName = (name) => {
    if (!name.trim()) {
      setIsRoomExists(null); // Reset when empty
      return;
    }

    setIsLoading(true);
    fetch(`/api/is_session_exit?name=${name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Return the promise for the next then
      })
      .then((data) => {
        console.log("Success:", data);
        setIsRoomExists(data.is_session_exit);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setIsRoomExists(null); // Reset on error
      });
  };

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(roomName);
    }, 500); // delay in ms

    return () => {
      clearTimeout(handler);
    };
  }, [roomName]);

  // Triggered after debounce
  useEffect(() => {
    if (debouncedQuery) {
      verifyRoomName(debouncedQuery);
    } else {
      setIsRoomExists(null); // Reset when input is empty
    }
  }, [debouncedQuery]);

  const getStatusIcon = () => {
    if (!roomName.trim()) return null; // No icon if no input
    if (isLoading)
      return (
        <div className="h-5 w-5 border-2 border-[#79bf44] border-t-transparent rounded-full animate-spin"></div>
      ); // Loading spinner
    if (isRoomExists === true)
      return <X size={20} className="text-red-500" strokeWidth={1.5} />;
    if (isRoomExists === false)
      return (
        <CircleCheck
          size={20}
          className="text-white fill-green-600"
          strokeWidth={1.5}
        />
      );
    return null; // No icon if not yet checked
  };

  const createRoom = () => {
    if (!isRoomExists && roomName.trim()) {
      const formattedRoomName = roomName.trim().replace(/\s+/g, "-");
      const newRoomUrl = `${window.location.protocol}//${window.location.host}?session=${formattedRoomName}`;

      fetch("/api/create_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionName: formattedRoomName }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Session created:", data);
          setRoomUrl(newRoomUrl);
          setSessionCreated(true);
        })
        .catch((error) => {
          console.error("Error creating session:", error);
          // Still show the URL even if DB insert fails
          setRoomUrl(newRoomUrl);
          setSessionCreated(true);
        });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e6f0e0]">
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-r from-[#79bf44]/90 to-[#006633]/90 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                <path d="M19.6 8.2c-.13-1.34-1-2.46-2.16-2.96-.37-.16-.7-.27-.97-.33a5.5 5.5 0 0 0-8.94 0c-.27.06-.6.17-.97.33-1.16.5-2.03 1.62-2.16 2.96-.06.64-.07 1.62.57 3.12.76 1.77 2.26 3.9 5.3 6.75.19.18.45.28.73.28.28 0 .54-.1.73-.28 3.04-2.84 4.54-4.98 5.3-6.75.64-1.5.63-2.48.57-3.12z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Knowledge Test</h1>
              <p className="text-white/80 text-sm">Admin Session Creator</p>
            </div>
          </div>
        </div>
        {/* Content area */}
        <div className="p-6">
          <div className="flex flex-col gap-5 items-center text-center mb-6">
            <div className="bg-[#f0f7eb] p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#006633]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[#006633] font-bold text-xl mb-2">
                Create Test Session
              </h2>
              <p className="text-gray-600 text-sm max-w-sm">
                Create a unique test session for your employees to evaluate
                their knowledge. Share the generated link with employees to
                start the test.
              </p>
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="relative">
              <input
                type="text"
                inputMode="text"
                placeholder="Enter session name"
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 px-5 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79bf44] focus:border-transparent transition-all duration-200"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {getStatusIcon()}
              </div>
            </div>

            {roomName.trim() && (
              <label
                className={`font-medium flex items-center gap-1 text-sm text-left px-5 mt-2 ${
                  isRoomExists === null
                    ? "text-gray-400"
                    : isRoomExists === false
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {isRoomExists === false
                  ? "Session name available"
                  : isRoomExists === true
                  ? "Session name already exists"
                  : "Checking availability..."}
              </label>
            )}
          </div>

          <button
            onClick={createRoom}
            disabled={!(roomName.trim() && isRoomExists === false)}
            className={`w-full py-3.5 px-5 rounded-full font-bold text-center transition-all duration-200
              ${
                roomName.trim() && isRoomExists === false
                  ? "text-white bg-gradient-to-r from-[#79bf44] to-[#006633] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  : "text-gray-500 bg-gray-100 cursor-not-allowed"
              }
            `}
          >
            Create Session
          </button>

          {roomUrl && sessionCreated && (
            <div className="mt-4 p-4 bg-white/80 rounded-lg border border-dark-green/20">
              <div className="flex items-center justify-center mb-2">
                <CircleCheck size={20} className="text-dark-green mr-2" />
                <p className="text-dark-green font-medium">
                  Test session created successfully!
                </p>
              </div>
              <p className="text-sm text-dark-green mb-2 font-medium">
                Test Session URL:
              </p>
              <div className="flex items-center justify-between bg-white border border-dark-green/30 rounded-full p-3">
                <input
                  type="text"
                  readOnly
                  value={roomUrl}
                  className="flex-1 outline-none text-gray-800 pr-2 overflow-x-auto bg-transparent"
                />
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-2 text-dark-green hover:text-[#79bf44] rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <CircleCheck className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {isCopied && (
                <p className="text-xs text-[#79bf44] mt-1 px-3">
                  Copied to clipboard! Send this to employees for testing.
                </p>
              )}
            </div>
          )}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default RoomCreator;
