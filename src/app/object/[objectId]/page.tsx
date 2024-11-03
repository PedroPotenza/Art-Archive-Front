"use client";
import { Archive, Heart, Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SkeletonLoader from "../../../components/skeletonLoader";
import axiosInstance from "../../../libs/axios/axios";
import { capitalizeWords, getContrastYIQ, hexToRgb, themeTailwindColorsToHex } from "../../util/converters";
import { ImageDetails, RecordDetails } from "../../util/models/models";
import TruncatedTextWithTooltip from "./components/truncatedTextWithTooltip";

export default function Object({ params }: { params: { objectId: string } }) {
  const [object, setObject] = useState<RecordDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leftColumnWidth, setLeftColumnWidth] = useState<number>(20);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [objectImages, setObjectImages] = useState<ImageDetails[]>([]);

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
      if (data) {
        setObject(data);
        if (data.images && data.images.length > 0) {
          setObjectImages(data.images.sort((a, b) => (a.displayorder ?? 0) - (b.displayorder ?? 0)));
        }
      }
    });
  }, [params.objectId]);

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
        style={{ width: `${leftColumnWidth}%`, minWidth: window.innerWidth < 1500 ? "30%" : "20%" }}
        className="bg-silver-gray h-full p-6 flex flex-col "
      >
        <div className="flex flex-col gap-1 border-l-[6px] pl-4 border-golden-yellow h-fit mb-6">
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
            <p className="text-2xl font-semibold line-clamp-2 2xl:line-clamp-3">{object.title}</p>
          ) : (
            <SkeletonLoader
              cssClass="w-full h-16"
              baseColor="bg-silver-gray-dark"
              shimmerColor={themeTailwindColorsToHex["silver-gray-lighter"]}
              type="rectangle"
            />
          )}
        </div>

        <div className="flex grow overflow-y-auto no-scrollbar">
          {!isLoading && object ? (
            <div className="flex flex-col pl-8 gap-4">
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
            <div className="flex items-center justify-center h-full w-full  ">
              <Loader2Icon size="64" className="animate-spin stroke-1" />
            </div>
          )}
        </div>

        <div className="flex justify-between h-fit items-center pt-4">
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

      {/* CONTENT - RIGHT SIDE */}
      <div className="w-full flex flex-col items-center  h-full overflow-y-auto text-almost-black p-8">
        <div className={`w-5/6 max-w-[1080px] flex h-full`}>
          {!isLoading && object ? (
            <div className="w-full flex flex-col gap-10">
              {object.images.length > 0 && (
                <div
                  className="w-full flex h-5/6 gap-2"
                  style={objectImages.length == 1 ? { justifyContent: "center", alignItems: "center" } : {}}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={objectImages[0].baseimageurl}
                      alt={objectImages[0].alttext ? objectImages[0].alttext : object.title}
                      fill
                      sizes="83%"
                      style={{ backgroundColor: isLoading ? "LightGray" : "", objectFit: "contain" }}
                      priority
                    />
                  </div>

                  {objectImages.length > 1 && (
                    <div className="w-2/5 h-full overflow-y-auto no-scrollbar flex flex-col gap-2">
                      {objectImages.slice(1).map((image, index) => (
                        <div key={index} className="relative w-full h-fit">
                          <Image
                            src={image.baseimageurl}
                            alt={image.alttext ? image.alttext : object.title}
                            width={image.width}
                            height={image.height}
                            style={{ width: "100%", height: "auto", objectFit: "contain" }}
                            priority
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1 border-l-[6px] pl-4 border-golden-yellow h-fit mb-6 ">
                <p className="text-md">ID {object.id}</p>

                <p className="text-2xl font-semibold 2xl:line-clamp-3">{object.title}</p>
              </div>

              {object.colors.length > 0 && (
                <div className="flex flex-col w-full gap-2">
                  <p className="text-lg font-semibold">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {object.colors.map((color, index) => {
                      const rgb = hexToRgb(color.color);
                      const textColorClass = getContrastYIQ(rgb);
                      const percent = color.percent * 100;

                      return (
                        <div
                          key={index}
                          className={`size-40 border border-black flex flex-col justify-center items-center gap-1 ${textColorClass}`}
                          style={{ backgroundColor: color.color }}
                        >
                          <p className="text-lg font-semibold">{color.hue}</p> {/* https://www.thecolorapi.com/docs */}
                          <p className="text-2xl font-semibold">{percent.toFixed(2)}%</p>
                          <p className="text-lg font-semibold">{color.color?.toUpperCase()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col w-full gap-2">
                <p className="text-lg font-semibold">Verification Level</p>
                <div className="flex gap-4 items-center">
                  <div
                    className={`size-16 flex items-center justify-center ${
                      object.verificationlevel === 4
                        ? "bg-green-700"
                        : object.verificationlevel === 3
                        ? "bg-golden-yellow"
                        : object.verificationlevel === 2
                        ? "bg-orange-500"
                        : object.verificationlevel === 1
                        ? "bg-red-600"
                        : "bg-almost-black"
                    }`}
                  >
                    <p
                      className={`font-bold text-4xl ${
                        object.verificationlevel === 4
                          ? "text-almost-white"
                          : object.verificationlevel === 3
                          ? "text-almost-white"
                          : object.verificationlevel === 2
                          ? "text-orange-500"
                          : object.verificationlevel === 1
                          ? "text-red-500"
                          : "text-almost-white"
                      }`}
                    >
                      {object.verificationlevel}
                    </p>
                  </div>
                  <p>
                    <strong>{object.verificationleveldescription.split(".")[0]}.</strong>
                    {object.verificationleveldescription.slice(object.verificationleveldescription.indexOf(".") + 1)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-lg font-semibold">Credit Line</p>
                <p>{object?.creditline}</p>
              </div>

              {/* This is needed because of the reference of height to render  the image in the right size. I made the container with height full and overflow, but the reference is the height full (of the container in the screen), and to make the the padding work right it should be h-fit (so the container could get all the content inside), but this will make the image distort - because the image is a proportion of 5/6 of the height of the h-full, so yeah, if you are my future me, I want you to know it's saturday 1:12 AM and I don't want to look to this problem anymore, so it's up to you. If you are not me, and still want to fix this, good luck! */}
              <div className="h-1 mt-[-16px] ">
                <p className="invisible">Yeah, this is a quick fix that probably will stay forever</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full  ">
              <Loader2Icon size="64" className="animate-spin stroke-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.requireAuth = false;
