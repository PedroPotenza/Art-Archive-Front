"use client";
import { Archive, Heart, Link, Loader2Icon, LucideMapPinned } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SkeletonLoader from "../../../components/skeletonLoader";
import axiosInstance from "../../../libs/axios/axios";
import { capitalizeWords, getContrastYIQ, hexToRgb, themeTailwindColorsToHex } from "../../util/converters";
import { ImageDetails, RecordDetails } from "../../util/models/models";
import TruncatedTextWithTooltip from "./components/truncatedTextWithTooltip";
import BirthIcon from "./icons/birthIcon";
import DeathIcon from "./icons/deathIcon";

export default function Object({ params }: { params: { objectId: string } }) {
  const [object, setObject] = useState<RecordDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [leftColumnWidth, setLeftColumnWidth] = useState<number>(20);
  // const resizerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [objectImages, setObjectImages] = useState<ImageDetails[]>([]);

  const getObjectDetails = async (): Promise<RecordDetails | null> => {
    setIsLoading(true);
    if (!params.objectId) return null;
    try {
      console.log("test");

      const response = await axiosInstance.get(`proxy/object/${params.objectId}`);
      // const data = response.data as RecordDetails;

      const responsePeople = await axiosInstance.get(`proxy/object/${params.objectId}/people`);

      await Promise.all(
        responsePeople.data.map(async (person: { personid: string }, index: number) => {
          const moreDetailsResponse = await axiosInstance.get(`proxy/person/?id=${person.personid}`);

          const data = moreDetailsResponse.data.records[0];
          const selectedAdditionalDetails = {
            objectcount: data.objectcount,
            url: data.url,
            datebegin: data.datebegin === 0 || data.datebegin === "" ? null : data.datebegin,
            dateend: data.dateend === 0 || data.dateend === "" ? null : data.dateend,
            displayname: data.displayname
          };
          responsePeople.data[index] = { ...responsePeople.data[index], ...selectedAdditionalDetails };

          return data;
        })
      );

      const normalizedFields = {
        ...response.data,
        datebegin: response.data.datebegin === 0 || response.data.datebegin === "" ? null : response.data.datebegin,
        dateend: response.data.dateend === 0 || response.data.dateend === "" ? null : response.data.dateend
      };

      const finalResponse = { ...normalizedFields, people: responsePeople.data };
      return finalResponse;
    } catch (error) {
      console.log("params.objectId", params.objectId);
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

  // const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!containerRef.current) return;

  //   const startX = e.clientX;
  //   const startWidth = leftColumnWidth;

  //   const handleMouseMove = (e: MouseEvent) => {
  //     const deltaX = e.clientX - startX;
  //     const containerWidth = containerRef.current!.offsetWidth;
  //     const newWidth = (((startWidth * containerWidth) / 100 + deltaX) / containerWidth) * 100;
  //     setLeftColumnWidth(Math.min(Math.max(newWidth, 20), 42));
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

  return (
    <div ref={containerRef} className="flex w-full h-full overflow-y-hidden relative text-almost-white">
      {/* SIDE MENU - LEFT SIDE */}
      <div
        className={`bg-silver-gray h-full p-6 flex flex-col min-w-[330px] ${
          window.innerWidth < 1500 ? "w-[30%]" : "w-[20%]"
        }`}
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

              {object.century && <TruncatedTextWithTooltip label="Century" text={object.century} />}

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

      {/* RESIZER */}
      {/* <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="w-1 h-full bg-golden-yellow cursor-ew-resize flex-shrink-0"
      /> */}
      <div className="w-1 h-full bg-golden-yellow cursor-ew-resize flex-shrink-0" />

      {/* CONTENT - RIGHT SIDE */}
      <div className="w-full flex flex-col items-center  h-full overflow-y-auto text-almost-black p-8">
        <div className={`w-5/6 max-w-[1080px] flex h-fit`}>
          {!isLoading && object ? (
            <div className="w-full flex flex-col gap-10  ">
              {/* h-[500px] lg:[700px] 2xl:h-[900px] */}
              {object.images.length > 0 && (
                <div
                  className="w-full flex gap-2 h-[calc((100vh-120px)*0.83)]"
                  style={objectImages.length == 1 ? { justifyContent: "center", alignItems: "center" } : {}}
                >
                  {/* <p>{objectImages[0].baseimageurl}</p> */}
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

              <div className="flex flex-col gap-1 border-l-4 pl-4 border-golden-yellow h-fit ">
                <div className="flex gap-2">
                  <p className="text-md">ID {object.id}</p>
                  <a
                    href={object.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs flex gap-1 items-center text-golden-yellow-dark"
                  >
                    <Link size={14} className="text-golden-yellow-dark" /> Harvard Page
                  </a>
                </div>

                <p className="text-2xl font-semibold 2xl:line-clamp-3">{object.title}</p>
              </div>

              {object.people && object.people.length > 0 && (
                <div className="w-full flex flex-col gap-6">
                  {object.people
                    .sort((a: any, b: any) => (a.displayorder ?? 0) - (b.displayorder ?? 0))
                    .map((artist: any, index: number) => (
                      <div key={index} className="w-full flex flex-col gap-2">
                        <p className="text-lg font-semibold">{artist.role}</p> {/*Change for person role */}
                        <div className="flex gap-2 border-4 border-golden-yellow rounded-2xl p-6 justify-between">
                          <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                              <p className="text-sm">ID {artist.personid}</p>

                              <a
                                href={artist.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs flex gap-1 items-center text-golden-yellow-dark"
                              >
                                <Link size={14} className="text-golden-yellow-dark" /> Harvard Page
                              </a>
                            </div>
                            <p className="text-lg font-semibold">
                              {artist.displayname ? capitalizeWords(artist.displayname) : "Unidentified Artist"}
                            </p>
                            <div className="flex gap-2 text-sm">
                              {artist.objectcount && artist.objectcount > 0 && (
                                <div className="flex gap-2 items-center">
                                  <p>
                                    <span className="font-semibold">{artist.objectcount}</span> Artworks
                                  </p>
                                  <div className="bg-golden-yellow size-[6px] rounded-full" />
                                </div>
                              )}
                              {artist.gender && artist.gender != "unknown" && (
                                <div className="flex gap-2 items-center">
                                  <p>{artist.gender}</p>
                                  <div className="bg-golden-yellow size-[6px] rounded-full" />
                                </div>
                              )}
                              {artist.culture && <p>{artist.culture}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            {artist.datebegin && artist.datebegin !== 0 && (
                              <div className="flex items-center gap-3">
                                <BirthIcon size={52} />
                                <div className="flex flex-col">
                                  <p className="text-2xl font-bold">{artist.datebegin}</p>
                                  {artist.birthplace && (
                                    <div className="flex gap-2">
                                      <LucideMapPinned size={20} className="text-silver-gray-lighter" />
                                      <p className="text-md">{artist.birthplace}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {artist.dateend && artist.dateend !== 0 && (
                              <div className="flex items-center gap-3">
                                <DeathIcon size={52} />
                                <div className="flex flex-col">
                                  <p className="text-2xl font-bold">{artist.dateend}</p>
                                  {artist.deathplace && (
                                    <div className="flex gap-1">
                                      <LucideMapPinned size={20} className="text-silver-gray-lighter" />
                                      <p className="text-md">{artist.deathplace}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {object.description && (
                <div className="w-full flex flex-col gap-4">
                  <p className="text-lg font-semibold">Description</p>
                  <p className="text-md">{object.description}</p>
                </div>
              )}

              {object.contextualtext && (
                <div className="w-full flex flex-col gap-4">
                  <p className="text-lg font-semibold">Context</p>

                  <div className="w-full flex flex-col gap-2">
                    {object.contextualtext.map((context, index) => {
                      if (!context.text) return null;

                      return (
                        <div key={index} className="flex flex-col gap-2">
                          <p className="text-md">
                            <span className="font-semibold">{context.type} </span> - {context.context}
                          </p>
                          <p>
                            {context.text.split("\n").map((line, lineIndex) => (
                              <React.Fragment key={lineIndex}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col gap-2">
                <p className="text-lg font-semibold">Details</p>
                <div className="w-full flex flex-col gap-4 border-golden-yellow h-fit mb-6 border-l-4 pl-6">
                  {object.classification && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Classification</p>
                      <p>{object.classification}</p>
                    </div>
                  )}

                  {object.worktypes && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Worktypes</p>
                      <p>{capitalizeWords(object.worktypes.map((worktype) => worktype.worktype).join(", "))}</p>
                    </div>
                  )}

                  {object.dimensions && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Dimensions</p>
                      <p>{object.dimensions}</p>
                    </div>
                  )}

                  {object.medium && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Medium</p>
                      <p>{object.medium}</p>
                    </div>
                  )}

                  {object.technique && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Technique</p>
                      <p>{object.technique}</p>
                    </div>
                  )}

                  {object.dated && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Date</p>
                      <p>{object.dated}</p>
                    </div>
                  )}

                  {object.datebegin ||
                    (object.dateend && (
                      <div className="flex">
                        {object.datebegin && (
                          <div className={`flex-col w-fit pr-6 border-r-4 border-golden-yellow`}>
                            <p className="text-sm font-semibold">Date Begin</p>
                            <p>{object.datebegin}</p>
                          </div>
                        )}

                        {object.dateend && (
                          <div className={`${object.datebegin ? "pl-6" : ""} flex-col w-fit`}>
                            <p className="text-sm font-semibold">Date End</p>
                            <p>{object.dateend}</p>
                          </div>
                        )}
                      </div>
                    ))}

                  {object.century && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Century</p>
                      <p>{object.century}</p>
                    </div>
                  )}

                  {object.period && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Period</p>
                      <p>{object.period}</p>
                    </div>
                  )}

                  {object.culture && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Culture</p>
                      <p>{object.culture}</p>
                    </div>
                  )}

                  {object.places && (
                    <div className={`flex-col w-fit`}>
                      <p className="text-sm font-semibold">Places</p>
                      <p>{object.places.map((place) => place.displayname).join(", ")}</p>
                    </div>
                  )}
                </div>
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
                    className={`size-16 shrink-0 flex items-center justify-center ${
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
                    <p className={`font-bold text-4xl text-almost-white`}>{object.verificationlevel}</p>
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
              {/* <div className="h-1 mt-[-16px] ">
                <p className="invisible">Yeah, this is a quick fix that probably will stay forever</p>
              </div> */}
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
