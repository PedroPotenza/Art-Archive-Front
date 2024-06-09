import "../globals.css";
import { colors } from "./colors";

export default function Page() {
  return (
    <div className="w-full flex justify-center items-center overflow-auto">
      <div className="flex flex-col gap-0 w-full p-20">
        {colors.map((color, index) => (
          <div key={index} className="w-full h-8 bg-gray-300" style={{ backgroundColor: color }}></div>
        ))}
      </div>
    </div>
  );
}
