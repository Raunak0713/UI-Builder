"use client";

import generateCode from "@/actions/generateCode";
import getTotalCredits from "@/actions/getTotalCredits";
import putUserInDatabase from "@/actions/putUserInDatabase";
import reduceCredit from "@/actions/reduceCredit";

import { BackgroundGrid } from "@/components/BackgroundGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Puzzle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "sonner";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const { user } = useUser();
  const { theme } = useTheme();
  const router = useRouter()

  useEffect(() => {
    const getCredits = async () => {
      if (user) {
        try {
          const credits = await getTotalCredits()
          setTotalCredits(credits)
        } catch (error) {
          console.log("Cant fetch user credits")
        }
      }
    }
    getCredits()
  }, [user])

  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await putUserInDatabase();
        } catch (error) {
          console.log("Error saving user in database")
        }
      }
    };
    if (user) saveUser();
  }, [user]);

  const handleSubmit = async () => {
    if (prompt.length < 6) {
      toast.error("❌ Give a Longer Prompt");
      return;
    }

    if (totalCredits <= 0) {
      toast.error("No Credits left, please buy more 💰💰");
      return;
    }

    try {
      toast.success("🔍 Generating...");
      setLoading(true);

      const result = await generateCode(prompt);

      if (result.error) {
        toast.error(result.error);
      } else if (result.output) {
        toast.success("✅ Generated Successfully");
        localStorage.setItem("generatedCode", result.output);
        router.push(`/code?prompt=${encodeURIComponent(prompt)}`);
        await reduceCredit(); // Reduce credits
        setPrompt("");
      } else {
        toast.error("❌ No valid content returned.");
      }
    } catch (error) {
      toast.error("❌ Error generating component");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen relative flex justify-center items-center">
      <BackgroundGrid />
      <div className="absolute top-[25%]">
        <div className="flex flex-col justify-center items-center">
          <p className={`text-center  text-3xl md:text-5xl font-semibold bg-gradient-to-r from-slate-50 to-zinc-800 bg-clip-text
            ${theme === "dark"
              ? "bg-black/85 text-white border-gray-600"
              : " text-gray-600"
            }
          `}>
            Design stunning UI components effortlessly <br /> with just one prompt.
          </p>
          {user ? (
            <div className="flex flex-col justify-center items-center">
              <Input
                className={`mt-6 md:mt-10 h-[50px] border-2 rounded-3xl w-full sm:w-full md:w-[40rem] lg:w-[50rem] 
                ${theme === "dark"
                    ? "bg-black/85 text-white border-gray-600"
                    : "bg-white text-black border-gray-600"
                  }`}
                placeholder="Create button with blue gradient ..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className={`mt-6 md:mt-10 text-lg md:px-8 md:py-6 font-semibold bg-gray-700 hover:bg-gray-600 flex items-center text-white`}
              >
                {loading ? "Generating..." : "Generate ✨"}
                <FaArrowRightLong className="text-xl md:text-4xl" />
              </Button>
              <Button
                className={`mt-6 py-5 md:mt-10 text-lg md:px-8 md:py-6 font-semibold bg-gray-700 hover:bg-gray-600 flex items-center text-white`}
                onClick={() => router.push("/components")}
                disabled={loading}
              >
                View your Components
                <Puzzle />
                <FaArrowRightLong className="text-xl md:text-4xl" />
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-20">
                {" "}
              </div>
              <SignInButton>
                <Button className={` bg-gray-700 text-white hover:bg-gray-600 text-base md:text-lg md:px-7 md:py-6
                  `}>
                  Learn More
                  <FaArrowRightLong className="text-xl md:text-4xl" />
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
