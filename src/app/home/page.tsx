"use client";
// import { getSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSession } from "../../actions/authActions";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";
import { Record } from "../util/models/models";

type ImageObject = {
  proportionalWidth: number;
  proportionalHeight: number;
} & Record;

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string>("");
  const [objects, setObjects] = useState<Record[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isInfiniteScrollLoading, setIsInfiniteScrollLoading] = useState<boolean>(false);
  // const [loadedImages, setLoadedImages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [smallestColumnHeight, setSmallestColumnHeight] = useState(0);

  const numberColumns = 5;
  const [columns, setColumns] = useState<ImageObject[][]>([]);

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

    const columnHeights = newColumns.map((col) =>
      col.reduce((acc, item) => acc + (item.images[0].height / item.images[0].width) * item.proportionalWidth!, 0)
    );
    setSmallestColumnHeight(Math.min(...columnHeights));

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

  const getObjects = async () => {
    const response = await axiosInstance.get(
      "proxy/object?sort=random&size=100&page=1&hasimage=1&q=imagepermissionlevel:0"
    );
    return response.data;
  };

  const getMoreObjects = async () => {
    console.log("currentPage", currentPage);

    if (isInfiniteScrollLoading) return;
    setIsInfiniteScrollLoading(true);

    try {
      const response = await axiosInstance.get(
        `proxy/object?sort=random&size=100&page=${currentPage + 1}&hasimage=1&q=imagepermissionlevel:0`
      );
      const newObjects = response.data.records;

      setObjects((prevObjects) => [...prevObjects, ...newObjects]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log("Erro ao carregar mais dados", error);
    } finally {
      setIsInfiniteScrollLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById("image-grid");
    if (!container) {
      console.error("Contêiner não encontrado");
      return;
    }

    const handleScroll = () => {
      if (smallestColumnHeight === 0) return;

      const scrollPosition = container.scrollTop;

      if (scrollPosition >= smallestColumnHeight - 1000 && !isInfiniteScrollLoading) {
        getMoreObjects();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [smallestColumnHeight, isInfiniteScrollLoading]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isLoading || !isMounted) {
        return;
      }

      try {
        setIsLoading(true);
        const objects = await getObjects();
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
    </div>
  );
}

Home.requireAuth = true;
