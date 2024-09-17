"use client";
// import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSession } from "../../actions/authActions";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string>("");
  const [objects, setObjects] = useState<any[]>([]);

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

  // quick test to see objects
  useEffect(() => {
    if (objects) {
      // console.log("objects", objects);
    }
  }, [objects]);

  const getObjects = async () => {
    const response = await axiosInstance.get("proxy/object?size=100&page=1");
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const objects = await getObjects();
      if (objects) {
        setObjects(objects);
      }
    };
    fetchData();
  }, []);

  return (
    <div className=" flex justify-center items-center w-full h-full p-16">
      {/* map objects */}
      <div className="flex flex-col w-[80%] h-fit border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Home Page</p>
        </div>
      </div>
    </div>
  );
}

Home.requireAuth = true;
