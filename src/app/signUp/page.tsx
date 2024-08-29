"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSession } from "../../actions/authActions";
import { signInGoogle, signUpEmailAndPassword } from "../../libs/firebase/auth";
import "../globals.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const router = useRouter();

  const signUpHandle = async () => {
    console.log("name", name);
    console.log("email", email);
    console.log("password matched?", password === passwordAgain);

    if (password !== passwordAgain) {
      alert("Password does not match");
      return;
    }

    const userUid = await signUpEmailAndPassword(email, password);

    if (userUid) {
      await createSession(userUid);
    }

    router.push("/home");
  };

  const handleSignInGoogle = async () => {
    const userUid = await signInGoogle(); //Probably I can use the credentials normally here this is something to look up another moment
    if (userUid) {
      await createSession(userUid);
    }

    router.push("/home");
  };

  return (
    <div className=" flex justify-center items-center w-full h-[100vh] p-12">
      <div className="flex flex-col w-[400px] h-fit border-4 border-almost-black rounded-2xl shadow-2xl">
        <div className="flex bg-almost-black w-full p-3 justify-center items-center">
          <p className="text-almost-white text-lg font-semibold">Register</p>
        </div>

        <div className="flex flex-col w-full p-4">
          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-almost-black text-md font-semibold">Name</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="email"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-almost-black text-md font-semibold">Email</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-almost-black text-md font-semibold">Password</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-almost-black text-md font-semibold">Confirm Password</label>
            <input
              className="w-full h-fit border-2  border-almost-black focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1"
              type="password"
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
            />
          </div>

          <div className="flex w-full">
            <button
              onClick={() => signUpHandle()}
              className="group relative overflow-hidden border-white w-full px-4 text-md mt-4 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="absolute inset-0 w-0 bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"></div>
              <span className="relative text-white group-hover:text-white">Sign In</span>
            </button>
          </div>

          <div className="flex w-full my-3 justify-center items-center">
            <p className="text-almost-black text-md font-medium">Or</p>
          </div>

          <div className="flex w-full">
            <button
              className="group relative overflow-hidden border-white w-full px-4 text-md focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              onClick={handleSignInGoogle}
            >
              <div className="absolute inset-0 w-0 bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"></div>
              <span className="relative text-white group-hover:text-white">Sign In with Google</span>
            </button>
          </div>

          <div className="flex w-full justify-center items-center mt-4">
            <p className="text-almost-black text-md">Already have an account?</p>
            <a href="/login" className="text-almost-black text-md ml-2">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
