"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";

const Header = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);
  return (
    <div className="fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center">
      <Link href="/">
        <h2 className="font-bold text-xl">DreamRender</h2>
      </Link>

      {initialLoading && status === "loading" ? (
        <BiLoaderCircle className="animate-spin" size={28} />
      ) : !session ? (
        <div className="__menu">
          <Button className="cursor-pointer" onClick={() => signIn("google")}>
            Login
          </Button>
        </div>
      ) : (
        <Avatar>
          <AvatarImage src={session.user?.image || ""} />
          <AvatarFallback>
            {session.user?.name?.charAt(0).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Header;
