"use client";
import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { createSession } from "../../actions/authActions";
// import { signInGoogle, signUpEmailAndPassword } from "../../libs/firebase/auth";
import "../globals.css";
import React from "react";

interface FormValues {
  email: string;
  password: string;
  passwordAgain: string;
  name: string;
}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<FormValues>({
    mode: "onSubmit"
  });

  const signUpHandle = async (data: FormValues) => {
    try {
      setLoading(true);
      setServerError(null);

      if (data.password !== data.passwordAgain) {
        setError("passwordAgain", { message: "Passwords do not match" });
        return;
      }

      // const userUid = await signUpEmailAndPassword(data.email, data.password);

      // if (userUid) {
      //   await createSession(userUid);
      //   reset();
      //   router.push("/home");
      // }

      reset();

      console.log("Sign up with email and password");
    } catch (error) {
      setServerError("An error occurred during sign-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInGoogle = async () => {
    // const userUid = await signInGoogle();
    // if (userUid) {
    //   await createSession(userUid);
    //   router.push("/home");
    // }
    console.log("Sign in with Google");
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh] p-12">
      <div className="flex flex-col w-[400px] h-fit border-4 border-almost-black rounded-2xl shadow-2xl">
        <div className="flex bg-almost-black w-full p-3 justify-center items-center">
          <p className="text-almost-white text-lg font-semibold">Register</p>
        </div>

        <div className="flex flex-col w-full p-4">
          {serverError && (
            <div className="bg-red-600 h-fit rounded-lg mb-4 p-2 items-center transition-transform transform duration-300 ease-out scale-105">
              <p className="text-white font-medium text-center">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(signUpHandle)} noValidate className="space-y-0">
            <div className="flex flex-col w-full gap-1">
              <label className="text-almost-black text-md font-semibold">Name</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 bg-almost-white  ${
                  errors.name ? "border-red-500" : "border-almost-black mb-4"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1`}
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-xs font-medium mb-2">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col w-full gap-1">
              <label className="text-almost-black text-md font-semibold">Email</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 bg-almost-white  ${
                  errors.email ? "border-red-500" : "border-almost-black mb-4"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1`}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs font-medium mb-2">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col w-full gap-1 ">
              <label className="text-almost-black text-md font-semibold">Password</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 bg-almost-white  ${
                  errors.password ? "border-red-500" : "border-almost-black mb-4"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1`}
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-xs font-medium mb-2">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col w-full gap-1">
              <label className="text-almost-black text-md font-semibold">Confirm Password</label>
              <input
                autoComplete="off"
                className={`w-full h-fit border-2 bg-almost-white  ${
                  errors.passwordAgain ? "border-red-500" : "border-almost-black mb-4"
                } focus-visible:border-golden-yellow-darker focus-visible:shadow-md rounded-md bg-almost-white text-md px-2 py-1`}
                type="password"
                {...register("passwordAgain", { required: "Please confirm your password" })}
              />
              {errors.passwordAgain && (
                <p className="text-red-500 text-xs font-medium mb-2">{errors.passwordAgain.message}</p>
              )}
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden border-white w-full px-4 text-md mt-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <div
                  className={`absolute inset-0 w-0 ${
                    loading ? "" : "bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"
                  }`}
                ></div>
                <span className="relative text-white group-hover:text-white flex justify-center">
                  {loading ? <Loader2 size={24} className="animate-spin" /> : "Sign Up"}
                </span>
              </button>
            </div>
          </form>

          <div className="flex w-full my-3 justify-center items-center">
            <p className="text-almost-black text-md font-medium">Or</p>
          </div>

          <div className="flex w-full">
            <button
              className="group relative overflow-hidden border-white w-full px-4 text-md focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              onClick={handleSignInGoogle}
            >
              <div className="absolute inset-0 w-0 bg-golden-yellow-dark transition-all duration-[750ms] ease-out group-hover:w-full"></div>
              <span className="relative text-white group-hover:text-white">Sign Up with Google</span>
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
