import { useAtom } from "jotai";
import { Loader2Icon, SwatchBook } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { colorsAtom, selectedFiltersAtom } from "../atoms";
import { ColorDisplayName, ColorFilter } from "../models";

export default function Colors() {
  const [colors, setColors] = useAtom<ColorFilter[]>(colorsAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredColors, setFilteredColors] = useState<ColorFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  function isGray(r: number, g: number, b: number): boolean {
    return r === g && g === b;
  }

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h /= 6;
    }
    return { h: h * 360, s, l };
  }

  function getContrastYIQ({ r, g, b }: { r: number; g: number; b: number }) {
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "text-almost-black" : "text-almost-white";
  }

  const getColors = async (): Promise<ColorFilter[]> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`proxy/color?size=1000`);
      return response.data.records;
    } catch (error) {
      console.error("Error fetching colors:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchColors = async () => {
      if (colors.length === 0) {
        const fetchedColors = await getColors();

        const sortedColors = fetchedColors.sort((a, b) => {
          const { r: rA, g: gA, b: bA } = hexToRgb(a.hex);
          const { r: rB, g: gB, b: bB } = hexToRgb(b.hex);

          const grayA = isGray(rA, gA, bA);
          const grayB = isGray(rB, gB, bB);

          if (grayA && grayB) {
            const { l: lA } = rgbToHsl(rA, gA, bA);
            const { l: lB } = rgbToHsl(rB, gB, bB);
            return lA - lB;
          } else if (grayA) {
            return -1;
          } else if (grayB) {
            return 1;
          } else {
            const { h: hA, l: lA } = rgbToHsl(rA, gA, bA);
            const { h: hB, l: lB } = rgbToHsl(rB, gB, bB);
            return hA === hB ? lA - lB : hA - hB;
          }
        });

        setColors(sortedColors);
      } else {
        setIsLoading(false);
      }
    };
    fetchColors();
  }, [colors, setColors]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredColors(
        colors.filter((color) => {
          const colorName = ColorDisplayName[color.name as keyof typeof ColorDisplayName].toLowerCase();
          const hexValue = color.hex.toLowerCase();
          const term = searchTerm.toLowerCase();
          return colorName.includes(term) || hexValue.includes(term);
        })
      );
    } else {
      setFilteredColors(colors);
    }
  }, [searchTerm, colors]);

  const handleSelectColor = (colorHex: string) => {
    const colorIndex = selectedFilters.colors.indexOf(colorHex); // -1 if not found
    if (colorIndex === -1) {
      setSelectedFilters((prev) => ({ ...prev, colors: [...prev.colors, colorHex] }));
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        colors: prev.colors.filter((color) => color !== colorHex)
      }));
    }
  };

  return (
    <div className="flex flex-col gap-6 text-white w-full transition-transform duration-200 ease-in-out ">
      <h1 className="text-4xl font-bold mt-4 ml-4">Colors</h1>

      {isLoading && colors.length === 0 ? (
        <div className="self-center mt-8 flex flex-col items-center gap-2">
          <Loader2Icon size={80} className="animate-spin stroke-1" />
          <span className="text-sm">Searching Colors</span>
        </div>
      ) : (
        <div className="flex flex-col w-full px-4 gap-4">
          <input
            type="text"
            placeholder="Search colors by name or hex code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-400 rounded-lg w-full"
          />

          <div className="grid grid-cols-2 gap-4">
            {filteredColors.length !== 0
              ? filteredColors.map((color) => {
                  const rgb = hexToRgb(color.hex);
                  const textColorClass = getContrastYIQ(rgb);

                  return (
                    <div
                      key={color.name}
                      className={`flex items-end h-20 border-[1px] border-almost-white bg-opacity-30 hover:scale-105 transition-transform duration-200 ease-in-out p-2 cursor-pointer ${
                        selectedFilters.colors.includes(color.hex)
                          ? `ring-4 ring-almost-white ring-offset-2 ring-offset-golden-yellow border-golden-yellow`
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleSelectColor(color.hex)}
                    >
                      <div className={`flex flex-col gap-1 ${textColorClass}`}>
                        <span className="text-xs font-medium">
                          {ColorDisplayName[color.name as keyof typeof ColorDisplayName]}
                        </span>
                        <span className="text-md font-bold">{color.hex.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })
              : searchTerm !== "" && (
                  <div className="self-center justify-self-center flex flex-col items-center text-center max-w-[70%] col-span-2 ">
                    <SwatchBook size={64} className="stroke-1 text-silver-gray-lighter mb-4" />
                    <span className="mb-4">
                      No results for <span className="font-semibold">&quot;{searchTerm}&quot;</span>
                    </span>
                    <span>Try a different search term usign the color name or hex code.</span>
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
