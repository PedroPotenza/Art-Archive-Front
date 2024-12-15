"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { createSession } from "../../actions/authActions";
// import { signInEmailAndPassword, signInGoogle } from "../../libs/firebase/auth";
import "../globals.css";
import React from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<FormValues>({
    mode: "onSubmit"
  });

  const handleSignInGoogle = async () => {
    // const userUid = await signInGoogle(); // Probably I can use the credentials normally here this is something to look up another moment
    // if (userUid) {
    //   await createSession(userUid);
    // }
    console.log("Sign in with Google");

    router.push("/home");
  };

  const handleSignInEmailAndPassword = async (data: FormValues) => {
    try {
      setLoading(true);
      // const userUid = await signInEmailAndPassword(data.email, data.password);

      // if (userUid) {
      //   await createSession(userUid);
      //   reset();
      //   setServerError(null);
      // }

      console.log("data", data.email);

      reset();

      console.log("Sign in with email and password");

      router.push("/home");
    } catch (error) {
      setServerError("Wrong email or password");
      setError("email", { type: "manual", message: "Invalid email or password" });
      setError("password", { type: "manual", message: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh] p-16">
      <div className="flex flex-col w-[400px] h-fit border-4 border-almost-black rounded-2xl shadow-2xl">
        <div className="flex bg-almost-black w-full p-3 justify-center items-center">
          <p className="text-almost-white text-lg font-semibold">Welcome Back!</p>
        </div>

        <div className="flex flex-col w-full p-4">
          {serverError && (
            <div className="bg-red-600 h-fit rounded-lg mb-4 p-1 items-center transition-transform transform duration-300 ease-out scale-105">
              <p className="text-white font-medium text-center text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleSignInEmailAndPassword)} noValidate className="space-y-0">
            <div className="flex flex-col w-full gap-1 ">
              <label className="text-almost-black text-md font-semibold">Email</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 ${
                  errors.email
                    ? "border-red-500 bg-transparent focus-visible:border-red-500"
                    : "border-almost-black bg-almost-white mb-4"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md text-md px-2 py-1 `}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })}
                onChange={() => clearErrors("email")}
              />
              {errors.email && <p className="text-red-500 text-xs font-medium mb-2">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col w-full gap-1 ">
              <label className="text-almost-black text-md font-semibold">Password</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 ${
                  errors.password
                    ? "border-red-500 bg-transparent focus-visible:border-red-500"
                    : "border-almost-black bg-almost-white"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md text-md px-2 py-1 mb-0`}
                type="password"
                {...register("password", { required: "Password is required" })}
                onChange={() => clearErrors("password")}
              />
              {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex flex-row w-full justify-between items-start">
              <span
                className="text-almost-black text-sm font-semibold m-2 hover:underline hover:text-golden-yellow-dark cursor-pointer"
                onClick={() => console.log("forgot password")}
              >
                Forgot password?
              </span>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden border-white w-28 px-4 text-md mt-6 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <div
                  className={`absolute inset-0 w-0 ${
                    loading ? "" : "bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"
                  }`}
                ></div>
                <span className="relative text-white group-hover:text-white flex justify-center">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : "Login"}
                </span>
              </button>
            </div>
          </form>

          <div className="flex w-full justify-center items-center my-2">
            <p className="text-almost-black text-md font-semibold">Or</p>
          </div>

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
