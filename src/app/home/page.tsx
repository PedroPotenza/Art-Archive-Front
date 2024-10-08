"use client";
// import { getSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSession } from "../../actions/authActions";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";
import { Record } from "../util/models/models";
import ImageViewer from "./components/imageViewer";
// import { useRouter } from "next/router";

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
  // const [loadedImages, setLoadedImages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [smallestColumnHeight, setSmallestColumnHeight] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ImageObject | null>(null);

  const numberColumns = 5;
  const [columns, setColumns] = useState<ImageObject[][]>([]);

  const [randomSeed, setRandomSeed] = useState(0);
  // const router = useRouter();

  const calculateColumns = () => {
    const newColumns: ImageObject[][] = Array(numberColumns)
      .fill([])
      .map(() => []);

    const whitespace = numberColumns * 8 + 32 + 16; // 4px of margin on each side + 16 padding of the container off each side + 16 because of the scrollbar
    const totalWidth = window.innerWidth - whitespace; // get the total width of the window minus the whitespaces

    // Distribui as primeiras imagens proporcionalmente entre as colunas
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

    // Adiciona as próximas imagens na coluna com a menor altura
    objects.slice(numberColumns).forEach((obj) => {
      const columnHeights = newColumns.map((col) =>
        col.reduce((acc, item) => acc + (item.images[0].height / item.images[0].width) * item.proportionalWidth!, 0)
      );
      const smallestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      newColumns[smallestColumnIndex].push({
        ...obj,
        proportionalWidth: newColumns[smallestColumnIndex][0].proportionalWidth, // O width da coluna será o mesmo para todas as imagens
        proportionalHeight:
          (obj.images[0].height / obj.images[0].width) * newColumns[smallestColumnIndex][0].proportionalWidth
      });
    });

    // const columnHeights = newColumns.map((col) =>
    //   col.reduce((acc, item) => acc + (item.images[0].height / item.images[0].width) * item.proportionalWidth!, 0)
    // );
    // setSmallestColumnHeight(Math.min(...columnHeights));

    setColumns(newColumns);
  };

  useEffect(() => {
    if (objects.length === 0) return;
    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => {
      window.removeEventListener("resize", calculateColumns);
    };
  }, [objects, numberColumns]);

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

  // quick test to see user session id
  useEffect(() => {
    if (userSessionId) {
      // console.log("userSessionId", userSessionId);
    }
  }, [userSessionId]);

  // ----------------------------------------------------------------- //

  // useEffect(() => {
  //   if (!router.isReady) return; // Espera o router estar pronto (necessário no Next.js)

  //   const seedFromUrl = router.query.seed;

  //   if (seedFromUrl) {
  //     // Se houver uma seed na URL, use-a
  //     setRandomSeed(parseInt(seedFromUrl as string, 10));
  //     console.log('Seed from URL:', seedFromUrl);
  //   } else if (isFirstLoad) {
  //     // Caso contrário, gere uma nova seed e adicione à URL
  //     const newSeed = Math.floor(Math.random() * 1000000);
  //     setRandomSeed(newSeed);
  //     console.log('Generated random seed:', newSeed);

  //     // Atualize a URL para incluir a seed sem recarregar a página
  //     router.replace(
  //       {
  //         pathname: router.pathname,
  //         query: { seed: newSeed },
  //       },
  //       undefined,
  //       { shallow: true } // Evita uma nova requisição de página
  //     );
  //   }

  //   setIsFirstLoad(false); // Marca que a página foi carregada pela primeira vez
  // }, [isFirstLoad, router]);

  // ----------------------------------------------------------------- //

  const getObjects = async (seed: number) => {
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
      const newObjects = response.data.records;
      setObjects((prevObjects) => [...prevObjects, ...newObjects]);
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
    if (currentPage === 1) return;
    getMoreObjects();
  }, [currentPage]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isLoading || !isMounted) {
        return;
      }

      const seed = Math.floor(Math.random() * 1000000);

      if (isFirstLoad) {
        setRandomSeed(seed);
        console.log("randomSeed", seed);
      }

      try {
        setIsLoading(true);
        const objects = await getObjects(seed);
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

  // useEffect(() => {
  //   if(!isFirstLoad) {
  //   setRandomSeed(Math.floor(Math.random() * 1000000));
  //   console.log("randomSeed", randomSeed);
  //   console.log("Math.random()", Math.floor(Math.random() * 1000000));
  //   }
  // }, [isFirstLoad]);

  const handleImageClick = (image: ImageObject) => {
    setSelectedImage(image);
  };

  return (
    <div className="w-full h-full p-4 overflow-x-hidden" id="image-grid">
      {(isLoading || isFirstLoad) && (
        <div className="flex h-full justify-center items-center">
          <p>Loading...</p>
        </div>
      )}

      <div style={{ display: "flex" }} className="w-fit">
        {columns.map((column, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            {column.map((image, i) => (
              <Image
                key={i}
                className="m-1"
                style={{ backgroundColor: image.colors ? image.colors[0].color : "LightGray" }}
                src={image.images[0].baseimageurl}
                alt={image.title}
                width={image.proportionalWidth}
                height={image.proportionalHeight}
                title={`coluna ${index}, imagem ${i}`}
                priority={i <= 6} //the first 7 images will be prioritized bacuase they are the first to be shown of this column
                onClick={() => handleImageClick(image)}
                // onLoad={() => setLoadedImages((prev) => prev + 1)}
                // placeholder="blur"
                // blurDataURL={`${image.images[0].baseimageurl}?height=10&width=10`}
                // layout="responsive"
                // onLoadingComplete={() => console.log(`Image ${image.id} loaded`)}
                // title={`Image ph ${image.proportionalHeight} and pw ${image.proportionalWidth}`}
              />
            ))}
          </div>
        ))}
      </div>

      {!isLoading && !isFirstLoad && !objects && (
        <p>No objects found</p> // Renderiza uma mensagem caso objects não tenha nenhum dado
      )}

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
  );
}

Home.requireAuth = true;
