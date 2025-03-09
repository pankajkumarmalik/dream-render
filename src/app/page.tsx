"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";

export default function Home() {
  // const { data: session } = useSession();
  // const router = useRouter();
  //const [open, setOpen] = useState(false);

  // const handleStartCreating = () => {
  //   if (session) {
  //     router.push("/create"); // Redirect if logged in
  //   } else {
  //     setOpen(true); // Show login popup if not logged in
  //   }
  // };

  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center">
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
            <Button className="mt-5 font-semibold px-6 py-3 animate-bounce flex items-center gap-2">
              <span>Start Creating</span>
              <MdKeyboardDoubleArrowRight
                size={32}
                className="translate-y-[1px]"
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 🚀 Login Popup
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-black text-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Please log in to continue creating.
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
      </Dialog> */}
    </div>
  );
}
