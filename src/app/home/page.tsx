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
} & Record;

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string>("");
  const [objects, setObjects] = useState<Record[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const numberColumns = 8;
  const [columns, setColumns] = useState<ImageObject[][]>([]);

  const calculateColumns = () => {
    const newColumns: ImageObject[][] = Array(numberColumns)
      .fill([])
      .map(() => []);
    const totalWidth = window.innerWidth - 32; // get the total width of the window minus the padding of the container

    // Distribui as primeiras imagens proporcionalmente entre as colunas
    const firstImages = objects.slice(0, numberColumns);
    const totalFirstWidths = firstImages.reduce((acc, obj) => acc + obj.images[0].width + 8, 0); //4px of margin on each side (8px total)

    // console.group("calculateColumns");
    // console.log("totalFirstWidths", totalFirstWidths);
    // console.log("totalWidth", totalWidth);
    // console.groupEnd();

    firstImages.forEach((obj, index) => {
      const imageWidthWithMargin = obj.images[0].width; //4px of margin on each side
      const porcentProportionalWidth = (imageWidthWithMargin * 100) / totalFirstWidths;

      const proportionalWidth = (porcentProportionalWidth * totalWidth) / 100;

      // const proportionalWidth = (imageWidthWithMargin * totalWidth) / totalFirstWidths;
      console.group(`firstImages index ${index}`);
      console.log("imageWidthWithMargin", imageWidthWithMargin);
      console.log("totalFirstWidths", totalFirstWidths);
      console.log("totalWidth", totalWidth);
      console.log("proportionalWidth", proportionalWidth);

      newColumns[index] = [
        {
          ...obj,
          proportionalWidth: proportionalWidth
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
        proportionalWidth: newColumns[smallestColumnIndex][0].proportionalWidth // O width da coluna será o mesmo para todas as imagens
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
    <div className="w-full h-full p-4">
      {(isLoading || isFirstLoad) && (
        <div className="flex h-full justify-center items-center">
          <p>Loading...</p>
        </div>
      )}

      <div style={{ display: "flex" }}>
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

              <div
                key={i}
                style={{
                  // width: `${image.proportionalWidth}px`,

                  margin: "4px"
                }}
                className="bg-gray-400 w-fit"
              >
                {/* <p>{image.title}</p>
                <p> PROPORCIONAL WIDTH {image.proportionalWidth} </p>
                <p> HEIGHT: {image.images[0].height}</p>
                <p> WIDTH: {image.images[0].width}</p> */}
                {/*
                
                <img
                  src={image.images[0].baseimageurl}
                  alt={image.images[0].alttext}
                  style={{ width: `${image.proportionalWidth}px`, height: "auto" }}
                  // className="hover:scale-105 transition-transform duration-100 hover:ring-4  hover:ring-almost-white"
                />
                */}

                <Image
                  src={image.images[0].baseimageurl}
                  alt={image.title}
                  width={image.proportionalWidth}
                  height={image.images[0].height}
                  // layout="responsive"
                  // onLoadingComplete={() => console.log(`Image ${image.id} loaded`)}
                />
              </div>
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
