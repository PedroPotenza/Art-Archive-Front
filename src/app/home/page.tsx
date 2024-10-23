"use client";
import { useAtom } from "jotai";
import { Contrast, Expand, Heart } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSession } from "../../actions/authActions";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";
import { Record } from "../util/models/models";
import { isFilterOpenAtom } from "./components/filterSideMenu/atoms";
import FiltersSideMenu from "./components/filterSideMenu/filterSideMenu";
import ImageViewer from "./components/imageViewer";

type ImageObject = {
  proportionalWidth: number;
  proportionalHeight: number;
} & Record;

function useDebounce(func: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );
}

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string>("");
  const [objects, setObjects] = useState<Record[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isInfiniteScrollLoading, setIsInfiniteScrollLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageObject | null>(null);

  const numberColumns = 5;

  // const MINIMUM_WIDTH = 230;

  const [columns, setColumns] = useState<ImageObject[][]>([]);

  const url = new URL(window.location.href);
  const [randomSeed] = useState(
    url.searchParams.get("seed") ? parseInt(url.searchParams.get("seed")!, 10) : Math.floor(Math.random() * 1000000)
  );

  const [isFilterOpen] = useAtom(isFilterOpenAtom);

  // const balanceColumns = (columnIndexBelowMinimum: number, newColumns: ImageObject[][]) => {
  //   if (columnIndexBelowMinimum === -1) return newColumns;

  //   // console.log("newColumns", newColumns);
  //   console.log("columnIndexBelowMinimum", columnIndexBelowMinimum);
  //   console.log(
  //     "newColumns[columnIndexBelowMinimum][0].proportionalWidth",
  //     newColumns[columnIndexBelowMinimum][0].proportionalWidth + 8
  //   );

  //   const difference = MINIMUM_WIDTH - newColumns[columnIndexBelowMinimum][0].proportionalWidth + 8; //4px of margin on each side (8px total)

  //   console.log("difference", difference);

  //   //somar o valor de todos os proportionalWidths menos o do columnIndexBelowMinimum
  //   const totalWidth = newColumns.reduce((acc, col, index) => {
  //     if (index === columnIndexBelowMinimum) return acc;
  //     return acc + col[0].proportionalWidth + 8; //4px of margin on each side (8px total)
  //   }, 0);

  //   console.log("totalWidth", totalWidth);

  //   console.group("Before");
  //   newColumns.forEach((col, index) => {
  //     // if (index === columnIndexBelowMinimum) return;
  //     // NÃO APAGA PEDRO PELO AMOR DE DEUS
  //     if (index === columnIndexBelowMinimum) {
  //       const proportionalHeight = (col[0].images[0].height / col[0].images[0].width) * MINIMUM_WIDTH;

  //       newColumns[index] = [
  //         {
  //           ...col[0],
  //           proportionalWidth: MINIMUM_WIDTH,
  //           proportionalHeight: proportionalHeight
  //         }
  //       ];
  //     }

  //     const imageWidthWithMargin = col[0].proportionalWidth + 8; //4px of margin on each side (8px total)
  //     const porcentProportionalWidth = imageWidthWithMargin / totalWidth;

  //     const widthTosubtract = difference * porcentProportionalWidth;

  //     const newWidth = imageWidthWithMargin - widthTosubtract;

  //     console.log(
  //       `coluna ${index} - ${imageWidthWithMargin.toFixed(2)} - ${porcentProportionalWidth.toFixed(
  //         2
  //       )} - ${widthTosubtract.toFixed(2)} - ${newWidth.toFixed(2)}`
  //     );

  //     const proportionalHeight = (col[0].images[0].height / col[0].images[0].width) * newWidth;

  //     newColumns[index] = [
  //       {
  //         ...col[0],
  //         proportionalWidth: newWidth,
  //         proportionalHeight: proportionalHeight
  //       }
  //     ];
  //   });
  //   console.groupEnd();

  //   console.log("newColumns final balance", newColumns);

  //   return newColumns;
  // };

  const calculateColumns = (numberColumns: number) => {
    const newColumns: ImageObject[][] = Array(numberColumns)
      .fill([])
      .map(() => []);

    const imageGrid = document.getElementById("image-grid");
    if (!imageGrid) return;
    const imageGridWidth = imageGrid.getBoundingClientRect().width;

    const whitespace = numberColumns * 8 + 32 + 16; // 4px of margin on each side + 16 padding of the container off each side + 16 because of the scrollbar

    const totalWidth = isFilterOpen ? imageGridWidth - whitespace - 350 : imageGridWidth - whitespace;

    const firstImages = objects.slice(0, numberColumns);
    const totalFirstWidths = firstImages.reduce((acc, obj) => acc + obj.images[0].width + 8, 0); //4px of margin on each side (8px total)

    firstImages.forEach((obj, index) => {
      const imageWidthWithMargin = obj.images[0].width + 8; //4px of margin on each side (8px total)
      const porcentProportionalWidth = (imageWidthWithMargin * 100) / totalFirstWidths;

      const proportionalWidth = (porcentProportionalWidth * totalWidth) / 100;
      const proportionalHeight = (obj.images[0].height / obj.images[0].width) * proportionalWidth;

      newColumns[index] = [
        {
          ...obj,
          proportionalWidth: proportionalWidth,
          proportionalHeight: proportionalHeight
        }
      ];
    });

    // const columnIndexBelowMinimum = newColumns.findIndex((col) => col[0].proportionalWidth + 8 < MINIMUM_WIDTH); //4px of margin on each side (8px total)
    // newColumns = balanceColumns(columnIndexBelowMinimum, newColumns);

    // console.log("newColumns", newColumns);

    // POPULATING THE COLUMNS
    objects.slice(numberColumns).forEach((obj) => {
      const columnHeights = newColumns.map((col) =>
        col.reduce((acc, item) => acc + (item.images[0].height / item.images[0].width) * item.proportionalWidth!, 0)
      );
      const smallestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      if (newColumns[smallestColumnIndex].length !== 0) {
        newColumns[smallestColumnIndex].push({
          ...obj,
          proportionalWidth: newColumns[smallestColumnIndex][0].proportionalWidth,
          proportionalHeight:
            (obj.images[0].height / obj.images[0].width) * newColumns[smallestColumnIndex][0].proportionalWidth
        });
      }
    });

    setColumns(newColumns);
  };

  useEffect(() => {
    if (objects.length === 0) return;
    calculateColumns(numberColumns);
    window.addEventListener("resize", () => calculateColumns(numberColumns));

    return () => {
      window.removeEventListener("resize", () => calculateColumns(numberColumns));
    };
  }, [objects, numberColumns, window.innerWidth, isFilterOpen]);

  useEffect(() => {
    async function fetchSession() {
      const sessionId = await getSession();
      if (sessionId) {
        setUserSessionId(sessionId);
        // console.log("sessionId", sessionId);
      }
    }

    fetchSession();
  }, []);

  useEffect(() => {
    console.log("randomSeed", randomSeed);
  }, [randomSeed]);

  // quick test to see user session id
  useEffect(() => {
    if (userSessionId) {
      // console.log("userSessionId", userSessionId);
    }
  }, [userSessionId]);

  const getObjects = async (seed: number) => {
    //OPTIMIZE this could be refactored to be only one function with the getMoreObjects
    const response = await axiosInstance.get(
      `proxy/object?sort=random:${seed}&size=100&page=1&hasimage=1&q=imagepermissionlevel:0`
    );
    return response.data;
  };

  const getMoreObjects = async () => {
    try {
      const response = await axiosInstance.get(
        `proxy/object?sort=random:${randomSeed}&size=100&page=${currentPage}&hasimage=1&q=imagepermissionlevel:0`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching more objects", error);
    } finally {
      setIsInfiniteScrollLoading(false);
    }
  };

  const handleScroll = () => {
    const container = document.getElementById("image-grid");
    if (!container) return;

    const scrollPosition = container.scrollTop;
    const containerHeight = container.scrollHeight;
    const containerOffsetHeight = container.offsetHeight;

    if (scrollPosition + containerOffsetHeight >= containerHeight - 800 && !isInfiniteScrollLoading) {
      setIsInfiniteScrollLoading(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const debouncedHandleScroll = useDebounce(handleScroll, 500);

  useEffect(() => {
    const container = document.getElementById("image-grid");
    if (!container) {
      console.error("Image grid container not found");
      return;
    }

    container.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      container.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll]);

  useEffect(() => {
    const fetchMoreObjects = async () => {
      if (currentPage === 1) return;
      const newObjects = await getMoreObjects();
      newObjects.records.forEach((obj: Record) => {
        obj.isInverted = false;
      });

      setObjects((prevObjects) => [...prevObjects, ...newObjects.records]);
    };

    fetchMoreObjects();
  }, [currentPage]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isLoading || !isMounted) {
        return;
      }

      try {
        setIsLoading(true);
        const objects = await getObjects(randomSeed);
        objects.records.forEach((obj: Record) => {
          obj.isInverted = false;
        });

        if (objects && isMounted) {
          setObjects(objects.records);
        }
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          if (isFirstLoad) {
            setIsFirstLoad(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageClick = (image: ImageObject) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex w-full h-full overflow-y-hidden">
      <FiltersSideMenu />

      <div className="w-full p-4 overflow-x-hidden flex justify-end" id="image-grid">
        {(isLoading || isFirstLoad) && (
          <div className="flex h-full justify-center items-center self-center">
            <p>Loading...</p>
          </div>
        )}

        <div className="w-fit flex">
          {columns.map((column, index) => (
            <div key={index} className="flex flex-col cursor-pointer">
              {column.map((image, i) => (
                <div
                  key={i}
                  className="relative group"
                  onClick={() => console.log("redirect to image page")}
                  onAuxClick={() => console.log("open image in new tab")}
                >
                  <div className="absolute top-1 left-1 p-2 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={() => handleImageClick(image)}
                      className="bg-black bg-opacity-50 border-none w-fit h-fit p-1 focus:outline-none"
                    >
                      <Heart className="text-white w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute top-1 right-1 p-2 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {image.classification === "Photographs" && (
                      <button
                        onClick={() => {
                          setColumns((prevColumns) =>
                            prevColumns.map((col) =>
                              col.map((obj) => {
                                if (obj.id === image.id) {
                                  return { ...obj, isInverted: !obj.isInverted };
                                }
                                return obj;
                              })
                            )
                          );
                        }}
                        className="bg-black bg-opacity-50 border-none w-fit h-fit p-1 focus:outline-none"
                      >
                        <Contrast className="text-white w-5 h-5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleImageClick(image)}
                      className="bg-black bg-opacity-50 border-none w-fit h-fit p-1 focus:outline-none"
                    >
                      <Expand className="text-white w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute flex flex-col gap-1 justify-end inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-3">
                    <p className="text-almost-white text-sm font-semibold line-clamp-2" title={image.title}>
                      {image.title}
                    </p>
                    <p
                      className="text-almost-white text-sm line-clamp-2"
                      title={`${
                        image.people
                          ?.filter((person) => person.role === "Artist")
                          .map((artist) => artist.displayname)
                          .join(", ") || "Unidentified Artist"
                      }`}
                    >
                      {image.people
                        ?.filter((person) => person.role === "Artist")
                        .map((artist, index) => (
                          <span key={index}>
                            {`${image.people
                              ?.filter((person) => person.role === "Artist")
                              .map((artist) => artist.displayname)
                              .join(", ")}`}
                          </span>
                        )) || <span>Unidentified Artist</span>}
                    </p>
                  </div>

                  <Image
                    className={`m-1 ${image.isInverted ? "invert" : ""}`}
                    style={{ backgroundColor: image.colors ? image.colors[0].color : "LightGray" }}
                    src={image.images[0].baseimageurl}
                    alt={image.title}
                    width={image.proportionalWidth}
                    height={image.proportionalHeight}
                    title={`coluna ${index}, imagem ${i}, classification: ${image.classification}`}
                    priority={i <= 6} //the first 7 images will be prioritized bacause they are the first to be shown of this column
                    onMouseEnter={() => {
                      setObjects((prev) =>
                        prev.map((obj) => {
                          if (obj.id === image.id) {
                            return { ...obj, isHover: true };
                          }
                          return obj;
                        })
                      );
                    }}
                    onMouseLeave={() => {
                      setObjects((prev) =>
                        prev.map((obj) => {
                          if (obj.id === image.id) {
                            return { ...obj, isHover: false };
                          }
                          return obj;
                        })
                      );
                    }}
                    // onLoad={() => setLoadedImages((prev) => prev + 1)}
                    // placeholder="blur"
                    // blurDataURL={`${image.images[0].baseimageurl}?height=10&width=10`}
                    // layout="responsive"
                    // onLoadingComplete={() => console.log(`Image ${image.id} loaded`)}
                    // title={`Image ph ${image.proportionalHeight} and pw ${image.proportionalWidth}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {!isLoading && !isFirstLoad && !objects && <p>No objects found</p>}

        {selectedImage && (
          <ImageViewer
            image={{
              url: selectedImage.images[0].baseimageurl,
              description: selectedImage.title
            }}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
}

Home.requireAuth = true;
