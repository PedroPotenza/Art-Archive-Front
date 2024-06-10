"use client";
import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
import "../globals.css";

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      // redirect("/login");
      console.log(
        "You are not logged in and using the onUnauthenticated function I can redirect you to the login page before rendering the Home page."
      );
    }
  });

  return (
    <div className=" flex justify-center items-center w-full h-[100vh] p-16">
      <div className="flex flex-col w-[500px] h-[100%] border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Home</p>
        </div>

        {session?.data ? (
          <div className="flex flex-col w-full h-[calc(100%-4rem)] p-4 gap-4">
            <p> {session?.data?.user?.email} </p>
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
