"use client";
// import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSession } from "../../actions/authActions";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";
import { Record } from "../util/models/models";

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string>("");
  const [objects, setObjects] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

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

      <div className="flex flex-wrap gap-4 overflow-y-auto">
        {!isLoading &&
          !isFirstLoad &&
          objects.map((object, index) => {
            return (
              <div key={index} className="w-64 bg-green-600 h-96 ">
                <img src={object.primaryimageurl} alt={object.title} className="object-contain" />
                <p className="text-almost-white text-sm">{object.title}</p>
                <p className="text-almost-white text-sm">{object.objectid}</p>

                {/*
              <div className="flex w-full h-96 justify-center items-center">
                <img src={object.primaryimageurl} alt={object.title} className="w-1/2 h-1/2" />
              </div> */}
              </div>
            );
          })}
      </div>

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
