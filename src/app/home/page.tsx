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

    // console.group("calculateColumns");
    // console.log("totalFirstWidths", totalFirstWidths);
    // console.log("totalWidth", totalWidth);
    // console.groupEnd();

    firstImages.forEach((obj, index) => {
      const imageWidthWithMargin = obj.images[0].width + 8; //4px of margin on each side (8px total)
      const porcentProportionalWidth = (imageWidthWithMargin * 100) / totalFirstWidths;

      const proportionalWidth = (porcentProportionalWidth * totalWidth) / 100;
      const proportionalHeight = (obj.images[0].height / obj.images[0].width) * proportionalWidth;

      // const proportionalWidth = (imageWidthWithMargin * totalWidth) / totalFirstWidths;
      // console.group(`firstImages index ${index}`);
      // console.log("imageWidthWithMargin", imageWidthWithMargin);
      // console.log("totalFirstWidths", totalFirstWidths);
      // console.log("totalWidth", totalWidth);
      // console.log("proportionalWidth", proportionalWidth);

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

    setColumns(newColumns);
  };

  useEffect(() => {
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

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) {
        console.log("Loading data...");
        return;
      }

      try {
        setIsLoading(true);
        const objects = await getObjects();
        if (objects) {
          setObjects(objects.records);
        }
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setIsLoading(false);
        if (isFirstLoad) {
          setIsFirstLoad(false);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full p-4 overflow-x-hidden">
      {(isLoading || isFirstLoad) && (
        <div className="flex h-full justify-center items-center">
          <p>Loading...</p>
        </div>
      )}

      <div style={{ display: "flex" }} className="w-fit">
        {columns.map((column, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            {column.map((image, i) => (
              // <img
              //   key={i}
              //   src={image.url}
              //   alt={image.title}
              //   style={{
              //     width: `${image.proportionalWidth}px`,
              //     height: "auto",
              //     marginBottom: "10px"
              //   }}
              // />

              // IF the image still not loaded, show a placeholder

              // <div
              //   key={i}
              //   style={{
              //     margin: "4px"
              //   }}
              //   className="bg-gray-300"

              // >
              <Image
                // src={`${image.images[0].baseimageurl}?height=${image.proportionalHeight.toFixed(
                //   0
                // )}&width=${image.proportionalWidth.toFixed(0)}`}
                key={i}
                className="m-1"
                style={{ backgroundColor: image.colors[0].color }}
                src={image.images[0].baseimageurl}
                alt={image.title}
                width={image.proportionalWidth}
                height={image.proportionalHeight}
                title={`${image.proportionalHeight}`}

                // placeholder="blur"
                // blurDataURL={`${image.images[0].baseimageurl}?height=10&width=10`}
                // layout="responsive"
                // onLoadingComplete={() => console.log(`Image ${image.id} loaded`)}
                // title={`Image ph ${image.proportionalHeight} and pw ${image.proportionalWidth}`}
              />
              /* <p>{image.title}</p>
                <p> PROPORCIONAL WIDTH {image.proportionalWidth} </p>
                <p> HEIGHT: {image.images[0].height}</p>
                <p> WIDTH: {image.images[0].width}</p> 

                <img
                  src={image.images[0].baseimageurl}
                  alt={image.images[0].alttext}
                  style={{ width: `${image.proportionalWidth}px`, height: "auto" }}
                  // className="hover:scale-105 transition-transform duration-100 hover:ring-4  hover:ring-almost-white"
                />

                */

              // </div>
            ))}
          </div>
        ))}
      </div>

      {/* <div className="gridContainer">
        {!isLoading &&
          !isFirstLoad &&
          objects.map((object: Record) => (
            <> */}
      {/* <img src={object.primaryimageurl} alt={object.title} className="object-contain" /> */}
      {/* <ImageGridItem image={object.images[0]} /> */}
      {/* <p className="text-almost-white text-sm">{object.title}</p>
                <p className="text-almost-white text-sm">{object.objectid}</p> */}
      {/* </>
          ))}
      </div> */}

      {/* {!isLoading && !isFirstLoad && (
        <div className="flex flex-col w-[80%] h-fit border-4 border-almost-black rounded-2xl mb-4">
          <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
            <p className="text-almost-white text-2xl">{objects[0].title}</p>
          </div>
        </div>
      )} */}

      {!isLoading && !isFirstLoad && !objects && (
        <p>No objects found</p> // Renderiza uma mensagem caso objects não tenha nenhum dado
      )}

      {/* <div className="flex flex-col w-[80%] h-fit border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Home Page</p>
        </div>
      </div> */}
    </div>
  );
}

Home.requireAuth = true;
