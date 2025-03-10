"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Carousel from "@/components/Carousel";
// Ensure correct import

function LandingPage() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center overflow-hidden relative bg-black text-white">
      {/* Main Content */}
      <div className="flex flex-col items-center gap-5">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          DreamRender
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="text-center text-white/50"
        >
          Type your dream image and render it in a second, with the power of AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0.7 }}
        >
          <Link href="/create">
            <Button className="mt-5 font-semibold px-6 py-3 flex items-center gap-2 animate-bounce">
              <span>Start Creating</span>
              <MdKeyboardDoubleArrowRight
                size={32}
                className="translate-y-[1px]"
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Carousel Section - Now takes only small height */}
      <motion.div
        initial={{
          opacity: 0,
          scaleY: 0.95,
          scaleZ: 0.95,
          filter: "blur(10px)",
        }}
        animate={{ opacity: 1, scaleY: 1, scaleZ: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, delay: 1.05 }}
        className="mt-30 w-full"
      >
        <Carousel />
      </motion.div>
    </div>
  );
}

export default LandingPage;
