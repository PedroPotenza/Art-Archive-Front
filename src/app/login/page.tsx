"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSession } from "../../actions/authActions";
import { signInEmailAndPassword, signInGoogle } from "../../libs/firebase/auth";
import "../globals.css";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignInGoogle = async () => {
    const userUid = await signInGoogle(); //Probably I can use the credentials normally here this is something to look up another moment
    if (userUid) {
      await createSession(userUid);
    }

    router.push("/home");
  };

  const handleSignInEmailAndPassword = async () => {
    const userUid = await signInEmailAndPassword(email, password);
    if (userUid) {
      await createSession(userUid);
    }

    router.push("/home");
  };

  return (
    <div className=" flex justify-center items-center w-full h-[100vh] p-16">
      <div className="flex flex-col w-[500px] h-fit border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Welcome back!</p>
        </div>

        <div className="flex flex-col w-full h-[calc(100%-4rem)] p-4 gap-4">
          <div className="flex flex-col w-full h-16">
            <label className="text-almost-black text-lg">Email</label>
            <input
              className="w-full h-10 border-2 border-almost-black rounded-md bg-almost-white"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full h-16">
            <label className="text-almost-black text-lg">Password</label>
            <input
              className="w-full h-10 border-2 border-almost-black rounded-md bg-almost-white"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-row w-full h-16 justify-start items-center">
            <a href="#" className="text-almost-black text-lg">
              Forgot password?
            </a>
          </div>

          <div className="flex w-full h-16">
            <button onClick={handleSignInEmailAndPassword} disabled={!email || !password}>
              Login
            </button>
          </div>

          <div className="flex w-full h-16 justify-center items-center">
            <p className="text-almost-black text-lg">Or</p>
          </div>

          <div className="flex w-full h-16">
            <button className="" onClick={handleSignInGoogle}>
              Login with Google
            </button>
          </div>

          <div className="flex w-full h-16 justify-center items-center">
            <p className="text-almost-black text-lg">Don&apos;t have an account?</p>
            <a href="/signUp" className="text-almost-black text-lg ml-2">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
