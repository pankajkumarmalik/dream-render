"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full h-[60px] bg-black border-b border-white/60 p-3 flex justify-between items-center">
      <Link href="/">
        <h2 className="font-bold text-xl">DreamRender</h2>
      </Link>
      <div className="__menu">
        <Button onClick={() => signIn("google")}>Login</Button>
      </div>
    </div>
  );
};

export default Header;
