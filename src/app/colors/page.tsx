import React from "react";
import "../globals.css";
import { colors } from "./colors";

export default function Page() {
  return (
    <div className="w-full flex justify-center overflow-auto">
      <div className="flex flex-row justify-between w-full p-20 gap-1">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col w-full">
            {color.map((shade, index) => (
              <div key={index} className="flex justify-center">
                <div className="w-full h-2 bg-gray-200" style={{ backgroundColor: shade }}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
