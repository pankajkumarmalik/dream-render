"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { BiLoaderCircle } from "react-icons/bi";
import Loader from "@/components/loader/Loader";
import Link from "next/link";

const formSchema = z.object({
  prompt: z
    .string()
    .min(5, { message: "Prompt must be at least 5 characters long" }),
});

const Page = () => {
  const { data: session } = useSession();
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // State for login popup

  const handleDownload = async () => {
    if (!outputImage) return;

    try {
      const response = await fetch(outputImage); // Fetch the image
      const blob = await response.blob(); // Convert response to Blob
      const url = URL.createObjectURL(blob); // Create a temporary URL

      const link = document.createElement("a");
      link.href = url;
      link.download = "generated-image.png"; // Filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // Cleanup the object URL
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      setOpen(true); // Show login popup if user is not logged in
      return;
    }

    setLoading(true);
    setOutputImage(null); // Clear previous image

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Image generation failed");

      await checkImageReady(data.url); // Poll until the image is available
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  }

  async function checkImageReady(url: string) {
    const maxRetries = 6; // 20 seconds (6 * 3s = 18s, close to 20s)
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await fetch(url, { method: "HEAD" });

        if (response.ok) {
          setOutputImage(url); // Set image once available
          return;
        }

        console.log("Checking is image ready ? ");
      } catch (error) {
        console.error(`Checking image status (Attempt ${retries + 1}):`, error);
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Retry after 3s
    }

    // If the image isn't ready after 20s, show an error message
    setOutputImage("error");
  }

  return (
    <div className="w-full p-3 h-screen flex justify-start items-center pt-[72px] flex-col  overflow-hidden">
      <div className="relative w-full p-4 md:p-6 rounded-lg shadow-lg overflow-hidden bg-black md:mb-2">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-black to-blue-900 animate-gradientMove"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-extrabold text-gray-200 text-3xl sm:text-4xl md:text-5xl tracking-wide">
            Create
          </h1>
          <p className="text-gray-400 text-sm md:text-xl mt-1 md:mt-2">
            Generate unlimited images from text for
            <span className="font-bold text-gray-100"> FREE!</span>
          </p>
        </div>
      </div>

      <style>
        {`
      @keyframes gradientMove {
        0% { background-position: 0% 40%; }
        50% { background-position: 100% 60%; }
        100% { background-position: 0% 40%; }
      }
      .animate-gradientMove {
        background-size: 250% 250%;
        animation: gradientMove 10s infinite alternate ease-in-out;
      }
    `}
      </style>

      <div className="flex w-full gap-3 h-[calc(100dvh-200px)] md:flex-row flex-col">
        <div className="__form h-full flex-[2] gap-3 flex justify-center items-start flex-col p-3">
          <p className="text-center w-full lg:text-left text-sm text-white/80">
            Type your prompt below to create any image you can imagine!
          </p>
          <div className="flex gap-2 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-full lg:max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="a cat sitting over a sofa..."
                          className="w-full transition-all border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  className={loading ? "opacity-50 pointer-events-none" : ""}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <BiLoaderCircle className="inline-block animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden flex flex-col justify-center items-center gap-3 p-3">
          {loading ? (
            // <p className="text-white/70 text-center p-3">
            //   Waiting for image to generate...
            // </p>
            <Loader />
          ) : outputImage === "error" ? (
            <p className="text-red-500 text-center p-3">
              AI is busy in generating, try again!
            </p>
          ) : outputImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.35, delay: 1.2 }}
              className="relative w-full h-full flex flex-col justify-center items-center"
            >
              <Link href="/profile" className="block w-full h-full">
                <Image
                  alt="Generated Image"
                  className="w-full h-full object-contain"
                  src={outputImage}
                  width={300}
                  height={300}
                />
              </Link>

              {/* Conditionally show the full button on md and larger screens */}
              <Button
                onClick={handleDownload}
                className="mt-3 w-full hidden md:block"
                variant="outline"
              >
                Download Image
              </Button>

              {/* Show an icon-only button on small screens */}
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 bg-white/30 rounded-full shadow-md md:hidden"
              >
                <Download className="w-6 h-6 text-white" />
              </motion.button>
            </motion.div>
          ) : (
            <p className="text-white/70 text-center p-3">
              Enter your prompt and hit Generate!
            </p>
          )}
        </div>
      </div>

      {/* Login Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-black text-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Please log in to generate images.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => signIn("google")}
              className="w-full font-semibold"
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
