import { useAtom } from "jotai";
import { useEffect } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { colorsAtom } from "../atoms";

export default function Colors() {
  const [colors, setColors] = useAtom(colorsAtom);

  const getColors = async () => {
    const response = await axiosInstance.get(`proxy/color?size=1000`);
    return response.data;
  };

  useEffect(() => {
    const fetchColors = async () => {
      if (colors.length === 0) {
        const fetchedColors = await getColors();
        setColors(fetchedColors.records);
      }
    };
    fetchColors();
  }, [colors, setColors]);

  return (
    <div className="flex flex-col gap-2 text-white w-[350px] transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl text-center font-bold mt-4">Colors</h1>

      <ul>
        {colors.length !== 0 ? (
          colors.map((color: any, index: number) => <li key={index}>{color.name}</li>)
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
}
