"use client";

import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/image");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to download an image
  const handleDownload = async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <BiLoaderCircle className="animate-spin" size={32} />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center col-span-full text-gray-500">
          No Images Available!
        </p>
      ) : (
        <AnimatePresence mode="wait">
          {posts.map((post, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={post.id}
              className="w-full"
            >
              <Image
                alt={post.prompt}
                src={post.url}
                width={250}
                height={250}
                className="object-cover w-full h-auto rounded-lg"
              />

              {/* Download Button (Bottom Left) */}
              <motion.button
                onClick={() => handleDownload(post.url)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 bg-white/30 rounded-full shadow-md backdrop-blur-sm"
              >
                <Download className="w-6 h-6 text-white" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Page;
