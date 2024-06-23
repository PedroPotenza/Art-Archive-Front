"use client";
import { useEffect } from "react";
import axiosInstance from "../../libs/axios/axios";
import "../globals.css";

export default function Home() {
  // const [userSessionId, setUserSessionId] = useState<string | null>(null);
  // const [objects, setObjects] = useState<any[]>([]);

  // useEffect(() => {
  //   async function fetchSession() {
  //     const sessionId = await getSession();
  //     setUserSessionId(sessionId);
  //   }

  //   fetchSession();
  // }, []);

  const getObjects = async () => {
    const response = await axiosInstance.get("/object?size=10&page=1");
    console.log(response);
  };

  useEffect(() => {
    console.log("useEffect running");
    getObjects();
  }, []);

  return (
    <div className=" flex justify-center items-center w-full h-full p-16">
      {/* map objects */}
      <div className="flex flex-col w-[80%] h-fit border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Object 1</p>
        </div>
      </div>
    </div>
  );
}

Home.requireAuth = true;
