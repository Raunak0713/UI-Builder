"use client";

import generateCode from "@/actions/generateCode";
import getTotalCredits from "@/actions/getTotalCredits";
import putUserInDatabase from "@/actions/putUserInDatabase";
import reduceCredit from "@/actions/reduceCredit";
import routeToCode from "@/actions/routeToCode";

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
      if(user){
        try {
          const credits = await getTotalCredits()
          setTotalCredits(credits)
        } catch(error){
          console.log("Cant fetch user credits")
        }
      }
    }
    getCredits()
  },[user])

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
        localStorage.setItem("generatedCode", result.output); // Store the code in localStorage
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
          <p className="text-center text-orange-500 text-3xl md:text-5xl font-semibold">
            Design stunning UI components effortlessly <br /> with just one prompt.
          </p>
          {user ? (
            <div className="flex flex-col justify-center items-center">
              {/* {registering && (
                <p className="text-sm text-gray-500 mt-2">Registering user...</p>
              )} */}
              <Input
                className={`mt-6 md:mt-10 h-[50px] border-2 w-full sm:w-full md:w-[40rem] lg:w-[50rem] 
                ${
                  theme === "dark"
                    ? "bg-black/85 text-white border-gray-600"
                    : "bg-white text-black border-orange-600"
                }`}
                placeholder="Create button with blue gradient ..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className={`mt-6 md:mt-10 text-lg md:px-8 md:py-6 font-semibold bg-orange-600 hover:bg-orange-600 flex items-center
                  ${
                  theme === "dark"
                    ? "text-white/90"
                    : "text-black/60"
                }`}
                >
                {loading ? "Generating..." : "Generate ✨"}
                <FaArrowRightLong className="text-xl md:text-4xl" />
              </Button>
              <Button
              className={`mt-6 py-5 md:mt-10 text-lg md:px-8 md:py-6 font-semibold bg-orange-600 hover:bg-orange-600 flex items-center
                ${
                theme === "dark"
                  ? "text-white/90"
                  : "text-black/60"
              }`}
              onClick={() => router.push("/components")}
              >
               View your Components
               <Puzzle />
               <FaArrowRightLong className="text-xl md:text-4xl" />
              </Button>
            </div>
          ) : (
            <SignInButton>
              <Button className={`mt-10 bg-orange-600 hover:bg-orange-600 text-base md:text-lg md:px-7 md:py-6
                ${
                  theme === "dark"
                    ? "text-white/90"
                    : "text-black/60"
                }`}>
                Learn More
                <FaArrowRightLong className="text-xl md:text-4xl" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
