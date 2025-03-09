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
    <div className="w-full p-3 min-h-dvh h-full flex justify-start items-center pt-[72px] flex-col">
      <div className="w-full border p-3">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/60 text-center">
          Generate unlimited images from text for FREE
        </p>
      </div>

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
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden flex justify-center items-center">
          {loading ? (
            <p className="text-white/70 text-center p-3">
              Waiting for image to generate...
            </p>
          ) : outputImage === "error" ? (
            <p className="text-red-500 text-center p-3">
              AI is busy in generating, try again!
            </p>
          ) : outputImage ? (
            <Image
              alt="Generated Image"
              className="w-full h-full object-contain"
              src={outputImage}
              width={300}
              height={300}
            />
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
