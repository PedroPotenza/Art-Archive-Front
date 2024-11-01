import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h2 className="text-9xl font-bold ">Not Found</h2>
      <div>
        <p className="text-2xl mt-6">
          Would you like to return to the <Link href="/">Home Page?</Link>
        </p>
      </div>
    </div>
  );
}
