"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import "../globals.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const router = useRouter();

  const signUpHandle = () => {
    createUserWithEmailAndPassword(auth, email, password);
    router.push("signIn");
  };

  return (
    <div className=" flex justify-center items-center w-full h-[100vh] p-12">
      <div className="flex flex-col w-[500px] h-[100%] border-4 border-almost-black rounded-2xl">
        <div className="flex bg-almost-black w-full h-16 p-4 justify-start items-center">
          <p className="text-almost-white text-2xl">Register</p>
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

          <div className="flex flex-col w-full h-16">
            <label className="text-almost-black text-lg">Confirm Password</label>
            <input
              className="w-full h-10 border-2 border-almost-black rounded-md bg-almost-white"
              type="password"
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
            />
          </div>

          <div className="flex w-full h-16">
            <button
              onClick={() => signUpHandle()}
              disabled={!email || !password || !passwordAgain || password !== passwordAgain}
            >
              Register
            </button>
          </div>

          <div className="flex w-full h-16 justify-center items-center">
            <p className="text-almost-black text-lg">Or</p>
          </div>

          <div className="flex w-full h-16">
            <button className="">Register with Google</button>
          </div>

          <div className="flex w-full h-16 justify-center items-center">
            <p className="text-almost-black text-lg">Already have an account?</p>
            <a href="/login" className="text-almost-black text-lg ml-2">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
