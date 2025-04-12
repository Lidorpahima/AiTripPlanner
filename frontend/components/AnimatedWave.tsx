// components/AnimatedWave.tsx
'use client';

import React from 'react';

interface AnimatedWaveProps {
  className?: string;
  path0ClassName?: string;
  path1ClassName?: string;
}

const AnimatedWave: React.FC<AnimatedWaveProps> = ({
    className = "",
    path0ClassName = "path-0",
    path1ClassName = "path-1"
}) => {
  return (
    <svg
      id="svg"
      
      viewBox="0 0 1440 590"
      xmlns="http://www.w3.org/2000/svg"
      // שנה כאן מ-slice ל-meet
      preserveAspectRatio="none"
      className={`transition duration-300 ease-in-out delay-150 ${className}`}
    >
      {/* ... paths ... */}
      <path
        d="M 0,600 L 0,150 C 65.8,147.2 131.6,144.4 224,137 C 316.4,129.6 435.4,117.5 518,116 C 600.6,114.5 646.9,123.5 708,118 C 769.1,112.5 845.2,92.6 926,90 C 1006.8,87.4 1092.5,102.1 1179,115 C 1265.5,127.9 1352.7,138.9 1440,150 L 1440,600 L 0,600 Z"
        stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="0.53"
        className={`transition-all duration-300 ease-in-out delay-150 ${path0ClassName}`}
      />
       <path
        d="M 0,600 L 0,350 C 88.7,344.9 177.5,339.8 251,351 C 324.5,362.2 382.8,389.8 456,391 C 529.2,392.2 617.4,366.9 711,351 C 804.6,335.1 903.6,328.7 993,337 C 1082.4,345.3 1162.1,368.4 1235,373 C 1307.9,377.6 1373.9,363.8 1440,350 L 1440,600 L 0,600 Z"
        stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="1"
        className={`transition-all duration-300 ease-in-out delay-150 ${path1ClassName}`}
      />
    </svg>
  );
};

export default AnimatedWave;