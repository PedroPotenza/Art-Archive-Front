"use client";
import { useRouter } from "next/navigation";
import { removeSession } from "../actions/authActions";
import ArtArchiveLogoWhite from "../assets/ArtArchiveLogoWhite";
import { useUserSession } from "../hooks/useUserSession";
import { signOut } from "../libs/firebase/auth";

export default function Header({ session }: { session: string | null }) {
  const router = useRouter();
  const userSessionId = useUserSession(session);

  const handleSignOut = async () => {
    await signOut();
    await removeSession();
  };

  return (
    <header className="flex flex-row w-full h-[80px] bg-almost-black px-8 justify-between items-center shrink-0">
      <div onClick={() => router.push("/home")} className="cursor-pointer">
        <ArtArchiveLogoWhite height={56} />
      </div>

      {userSessionId ? (
        <button
          className="flex w-fit  bg-golden-yellow-dark items-center hover:bg-golden-yellow-darker"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="flex w-fit  bg-golden-yellow-dark items-center hover:bg-golden-yellow-darker"
          onClick={() => router.push("/login")}
        >
          Sign In
        </button>
      )}
    </header>
  );
}
