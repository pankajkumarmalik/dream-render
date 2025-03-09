"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiLoaderCircle } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

const Header = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  return (
    <div className="fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center z-50">
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
        <Popover>
          <PopoverTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 shadow-md rounded-md flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => router.push("/profile")}
            >
              My Images
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <CiLogout />
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default Header;
