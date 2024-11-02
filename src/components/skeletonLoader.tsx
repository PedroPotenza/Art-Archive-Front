"use client";

import React, { FC, useMemo } from "react";

const LOADER_TYPES = {
  rectangle: "rectangle",
  circle: "circle"
} as const;

const LOADER_CSS_CLASSES = {
  [LOADER_TYPES.rectangle]: "rounded-lg",
  [LOADER_TYPES.circle]: "rounded-full"
};

type LoaderTypesKeys = keyof typeof LOADER_TYPES;
type LoaderTypesValues = (typeof LOADER_TYPES)[LoaderTypesKeys];

const DEFAULT_SHIMMER_COLOR = "#ffffff";
const DEFAULT_BASE_COLOR_CLASS = "bg-gray-300";

const isHexColor = (color: string) => {
  const hex = color.replace("#", "");
  return (
    typeof color === "string" &&
    color.startsWith("#") &&
    (hex.length === 3 || hex.length === 6) &&
    !isNaN(Number("0x" + hex))
  );
};

const hexToRgb = (hex: string) => {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

interface SkeletonLoaderProps {
  type?: LoaderTypesValues;
  baseColor?: string;
  cssClass?: string;
  shimmerColor?: string;
  children?: React.ReactNode;
}

const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  type = LOADER_TYPES.rectangle,
  baseColor = DEFAULT_BASE_COLOR_CLASS,
  cssClass = "",
  shimmerColor = DEFAULT_SHIMMER_COLOR,
  children
}) => {
  const isBaseColorHex = isHexColor(baseColor);

  const backgroundColorStyle = useMemo(() => {
    if (isBaseColorHex) {
      return { backgroundColor: baseColor };
    }
    return {};
  }, [baseColor]);

  const containerClassName = useMemo(() => {
    const classes = [cssClass || "", "relative", "overflow-hidden"];
    if (!isBaseColorHex) {
      classes.unshift(baseColor);
    }
    classes.push(LOADER_CSS_CLASSES[type]);
    return classes.join(" ").trim();
  }, [cssClass, type, baseColor]);

  const shimmerStyle = useMemo(() => {
    const rgb = isHexColor(shimmerColor) ? hexToRgb(shimmerColor) : hexToRgb(DEFAULT_SHIMMER_COLOR);

    return {
      backgroundImage: `linear-gradient(90deg, rgba(${rgb}, 0) 0%, rgba(${rgb}, 0.2) 20%, rgba(${rgb}, 0.5) 60%, rgba(${rgb}, 0))`
    };
  }, [shimmerColor]);

  return (
    <div className={containerClassName} style={backgroundColorStyle}>
      <div className="shimmer absolute top-0 right-0 bottom-0 left-0" style={shimmerStyle}></div>
      {children}
      {!children && <div className="invisible">placeholder</div>}
      <style>{`
        .shimmer {
          transform: translateX(-100%);
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
