"use client";

import React, { useState, useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [componentVisible, setComponentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        relative h-full w-full overflow-hidden
        transition-opacity duration-500 linear
        ${componentVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Animated Wavy Gradient Background */}
      <div className="absolute inset-0 z-[0]">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%),
              linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)
            `,
            backgroundSize: "400% 400%, 400% 400%",
            animation: "gradientWave 15s ease-in-out infinite",
          }}
        />

        {/* Wavy overlay for extra effect */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #f093fb 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #4facfe 0%, transparent 50%)
            `,
            backgroundSize: "300% 300%",
            animation: "waveMove 10s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.2),rgba(0,0,0,0.4))] z-[1]" />

      <div className="z-[4] h-full w-full flex flex-col items-center justify-center relative">
        <div className="h-full w-full md:h-auto md:w-[420px]">{children}</div>
      </div>

      <style jsx>{`
        @keyframes gradientWave {
          0%,
          100% {
            background-position: 0% 50%, 100% 50%;
          }
          25% {
            background-position: 100% 0%, 0% 100%;
          }
          50% {
            background-position: 100% 100%, 0% 0%;
          }
          75% {
            background-position: 0% 100%, 100% 0%;
          }
        }

        @keyframes waveMove {
          0% {
            background-position: 0% 0%, 100% 100%, 50% 50%;
            transform: scale(1) rotate(0deg);
          }
          50% {
            background-position: 100% 50%, 0% 50%, 80% 20%;
            transform: scale(1.1) rotate(2deg);
          }
          100% {
            background-position: 50% 100%, 50% 0%, 20% 80%;
            transform: scale(1.05) rotate(-1deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
