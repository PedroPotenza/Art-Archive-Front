"use client";

import { createSession, removeSession } from "../actions/authActions";
import { useUserSession } from "../hooks/useUserSession";
import { signInWithGoogle, signOut } from "../libs/firebase/auth";
import React from "react";

export function Header({ session }: { session: string | null }) {
  const userSessionId = useUserSession(session);

  const handleSignIn = async () => {
    const userUid = await signInWithGoogle(); //Probably I can use the credentials normally here this is something to look up another moment
    if (userUid) {
      await createSession(userUid);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    await removeSession();
  };

  if (!userSessionId) {
    return (
      <header className="flex flex-row w-full h-20 bg-almost-black mb-4">
        <button onClick={handleSignIn}>Sign In</button>
      </header>
    );
  }

  return (
    <header className="flex flex-row w-full h-20 bg-almost-black mb-4">
      <nav>
        <ul>
          <li>
            <a href="#">Menu A</a>
          </li>
          <li>
            <a href="#">Menu B</a>
          </li>
          <li>
            <a href="#">Menu C</a>
          </li>
        </ul>
      </nav>
      <button onClick={handleSignOut}>Sign Out</button>
    </header>
  );
}

export default Header;
