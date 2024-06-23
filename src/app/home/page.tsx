"use client";
import { signOut } from "next-auth/react";
import "../globals.css";
import { getSession } from "../../actions/authActions";
import { useEffect, useState } from "react";

export default function Home() {
  const [userSessionId, setUserSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionId = await getSession();
      setUserSessionId(sessionId);
    }

    fetchSession();
  }, []);

  return (
    <div className=" flex justify-center items-center w-full h-full p-16">
      <div className="flex flex-col w-[500px] h-[80%] border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Home</p>
        </div>

        {userSessionId ? (
          <div className="flex flex-col w-full h-[calc(100%-4rem)] p-4 gap-4">
            <p> Nome do usuario aqui: </p> <br />
            <p onClick={() => signOut()}> Logout </p>
          </div>
        ) : (
          <div className="flex flex-col w-full h-[calc(100%-4rem)] p-4 gap-4">
            <p> You are not logged in </p>
          </div>
        )}
      </div>
    </div>
  );
}

Home.requireAuth = true;
