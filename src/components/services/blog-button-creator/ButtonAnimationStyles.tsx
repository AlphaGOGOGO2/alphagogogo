
import React from "react";

export function ButtonAnimationStyles() {
  return (
    <style>
      {`
        @keyframes shiny {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shiny-button {
          background-size: 200% 100%;
          background-position: -100% 0;
        }
        .hover\\:scale-500:hover {
          transform: scale(1.2) !important;
          transition: transform 0.3s ease;
        }
        .active\\:scale-400:active {
          transform: scale(1.1) !important;
          transition: transform 0.2s ease;
        }
      `}
    </style>
  );
}
