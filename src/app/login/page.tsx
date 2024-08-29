"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createSession } from "../../actions/authActions";
import { signInEmailAndPassword, signInGoogle } from "../../libs/firebase/auth";
import "../globals.css";

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
      <div className="flex flex-col w-[400px] h-fit border-4 border-almost-black rounded-2xl shadow-2xl">
        <div className="flex bg-almost-black w-full p-3 justify-center items-center">
          <p className="text-almost-white text-lg font-semibold">Welcome Back!</p>
        </div>

        <div className="flex flex-col w-full p-4 ">
          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-almost-black text-md font-semibold">Email</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-1">
            <label className="text-almost-black text-md font-semibold">Password</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-row w-full justify-between items-start">
            <span className="text-almost-black text-sm font-semibold mt-1 ml-2 hover:underline hover:text-golden-yellow-dark">
              Forgot password?
            </span>

            <button
              onClick={handleSignInEmailAndPassword}
              disabled={!email || !password}
              className="group relative overflow-hidden border-white w-fit px-4 text-md mt-4 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div
                className={`absolute inset-0 w-0 ${
                  !email || !password
                    ? ""
                    : "bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"
                }`}
              ></div>
              <span className="relative text-white group-hover:text-white">Login</span>
            </button>
          </div>

          <div className="flex w-full justify-center items-center my-2">
            <p className="text-almost-black text-md font-semibold">Or</p>
          </div>

          {/* <img src="../../assets/google-icon.png" alt="google-icon" className="w-8 h-8" /> */}
          <button
            className="group relative overflow-hidden border-white text-md w-full focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-"
            onClick={handleSignInGoogle}
          >
            <div className="absolute inset-0 w-0 bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"></div>
            <span className="relative text-white group-hover:text-white">Login with Google</span>
          </button>

          <div className="flex w-full justify-center items-center mt-4">
            <p className="text-almost-black text-md">Don&apos;t have an account?</p>
            <a href="/signUp" className="text-almost-black text-md ml-2">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
