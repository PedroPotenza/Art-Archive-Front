"use client";
import { Archive, Heart, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SkeletonLoader from "../../../components/skeletonLoader";
import axiosInstance from "../../../libs/axios/axios";
import { capitalizeWords, themeTailwindColorsToHex } from "../../util/converters";
import { RecordDetails } from "../../util/models/models";
import TruncatedTextWithTooltip from "./components/truncatedTextWithTooltip";

export default function Object({ params }: { params: { objectId: string } }) {
  const [object, setObject] = useState<RecordDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leftColumnWidth, setLeftColumnWidth] = useState<number>(20);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getObjectDetails = async (): Promise<RecordDetails | null> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`proxy/object/${params.objectId}`);
      const data = response.data as RecordDetails;

      if (data.peoplecount > 0) {
        const responsePeople = await axiosInstance.get(`proxy/object/${params.objectId}/people`);
        const finalResponse = { ...response.data, people: responsePeople.data };
        return finalResponse;
      }

      const finalResponse = { ...response.data, people: [] };
      return finalResponse;
    } catch (error) {
      console.error("Failed to fetch object details:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getObjectDetails().then((data) => {
      if (data) setObject(data);
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const startX = e.clientX;
    const startWidth = leftColumnWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const containerWidth = containerRef.current!.offsetWidth;
      const newWidth = (((startWidth * containerWidth) / 100 + deltaX) / containerWidth) * 100;
      setLeftColumnWidth(Math.min(Math.max(newWidth, 20), 42));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div ref={containerRef} className="flex w-full h-full overflow-y-hidden relative text-almost-white">
      <div
        className="bg-silver-gray h-full p-6 flex flex-col"
        style={{ width: `${leftColumnWidth}%`, minWidth: "20%" }}
      >
        <div className="flex flex-col gap-1 border-l-[6px] pl-4 border-golden-yellow h-fit ">
          {!isLoading && object ? (
            <p className="text-md">ID {object.id}</p>
          ) : (
            <SkeletonLoader
              cssClass="text-sm w-20"
              baseColor="bg-silver-gray-dark"
              shimmerColor={themeTailwindColorsToHex["silver-gray-lighter"]}
              type="rectangle"
            />
          )}
          {!isLoading && object ? (
            <p className="text-2xl font-semibold line-clamp-3">{object.title}</p>
          ) : (
            <SkeletonLoader
              cssClass="w-full h-16"
              baseColor="bg-silver-gray-dark"
              shimmerColor={themeTailwindColorsToHex["silver-gray-lighter"]}
              type="rectangle"
            />
          )}
        </div>

        <div className="flex grow">
          {!isLoading && object ? (
            <div className="flex flex-col pl-8 mt-6 gap-4">
              {object.people?.some((person) => person.role === "Artist") && (
                <TruncatedTextWithTooltip
                  label="Artist"
                  text={
                    object.people
                      ?.filter((person) => person.role === "Artist")
                      .sort((a, b) => (a.displayorder ?? 0) - (b.displayorder ?? 0))
                      .map((artist) => artist.displayname)
                      .join(", ") || "Unidentified Artist"
                  }
                  tooltipContent={
                    <div className="px-1 py-2 max-w-[280px]">
                      <p className="font-semibold text-lg">Artist</p>
                      <ul className="list-disc pl-5">
                        {object.people
                          ?.filter((person) => person.role === "Artist")
                          .sort((a, b) => (a.displayorder ?? 0) - (b.displayorder ?? 0))
                          .map((artist, index) => (
                            <li key={index} className="text-sm">
                              {artist.displayname ? capitalizeWords(artist.displayname) : ""}
                            </li>
                          )) || <li className="text-sm">Unidentified Artist</li>}
                      </ul>
                    </div>
                  }
                />
              )}

              {object.classification && (
                <TruncatedTextWithTooltip label="Classification" text={object.classification} />
              )}

              {object.dimensions && <TruncatedTextWithTooltip label="Dimensions" text={object.dimensions} />}

              {object.medium && <TruncatedTextWithTooltip label="Medium" text={object.medium} />}

              {object.technique && <TruncatedTextWithTooltip label="Technique" text={object.technique} />}

              {object.period && <TruncatedTextWithTooltip label="Period" text={object.period} />}

              {object.culture && <TruncatedTextWithTooltip label="Culture" text={object.culture} />}

              {object.places && (
                <TruncatedTextWithTooltip
                  label="Places"
                  text={object.places.map((place) => place.displayname).join(", ")}
                />
              )}

              {object.worktypes && (
                <TruncatedTextWithTooltip
                  label="Worktypes"
                  text={capitalizeWords(object.worktypes.map((worktype) => worktype.worktype).join(", "))}
                  tooltipContent={
                    <div className="px-1 py-2 max-w-[280px]">
                      <p className="font-semibold text-lg">Worktypes</p>
                      <ul className="list-disc pl-5">
                        {object.worktypes.map((worktype, index) => (
                          <li key={index} className="text-sm">
                            {worktype.worktype ? capitalizeWords(worktype.worktype) : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full ">
              <Loader2Icon size="64" className="animate-spin stroke-1" />
            </div>
          )}
        </div>

        <div className="flex justify-between h-fit items-center">
          <Heart size="36" className="stroke-2 text-golden-yellow" />
          <button className="text-almost-white bg-golden-yellow-dark hover:bg-golden-yellow-darker w-fit flex justify-between p-2 px-8 rounded-xl text-lg gap-4 items-center">
            <Archive size="24" className="stroke-2" />
            Save this
          </button>
        </div>
      </div>

      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="w-1 h-full bg-golden-yellow cursor-ew-resize flex-shrink-0"
      />

      {/* Coluna Direita */}
      <div className={`w-full h-full overflow-y-auto flex flex-col gap-10 p-8`}>
        <p> content section</p>
        <p> content 2</p>
      </div>
    </div>
  );
}

Object.requireAuth = false;
