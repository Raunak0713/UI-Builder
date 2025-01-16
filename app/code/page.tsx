'use client';
import addComponentToUser from '@/actions/addComponentToUser';
import { SeeLivePreview } from '@/components/LivePreview';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { LiveEditor, LiveProvider } from 'react-live';
import { toast } from 'sonner';

const GeneratedCode = () => {
  const [preview, setPreview] = useState(false);
  const [code, setCode] = useState(""); // State to store the generated code
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const prompt = search.get('prompt'); // prompt can be string | null
  const { user } = useUser();
  const { theme } = useTheme();

  // Early return if prompt is missing
  if (prompt == null) {
    return <div></div>;
  }

  useEffect(() => {
    // Ensure localStorage is only accessed on the client side
    if (typeof window !== 'undefined') {
      const generatedCode = localStorage.getItem("generatedCode");
      if (generatedCode) {
        // console.log(generatedCode)
        // console.log(prompt)
        setCode(generatedCode);
        localStorage.removeItem("generatedCode"); // Clear the code from localStorage
      } else {
        console.log("No code found. Please generate a new component.");
        // router.push("/"); // Redirect to the home page if no code is found
      }
    }
  }, [router]);

  // Add the component to the user's library
  useEffect(() => {
    if (user && code) {
      const putComponent = async () => {
        try {
          const trimmedJSX = code.replace('jsx', '').replaceAll('```', '');
          console.log(code)
          console.log(prompt)
          const message = await addComponentToUser({ code: trimmedJSX, prompt });
          if (message === "created") {
            toast.success("Added to your Components Library");
          }
        } catch (error) {
          toast.error("Failed to add component to library");
          console.error(error);
        }
      };
      putComponent();
    }
  }, [user, code, prompt]); // Add prompt to the dependency array

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleCopy = async () => {
    try {
      const trimmedJSX = code.replace('jsx', '').replaceAll('```', '');
      await navigator.clipboard.writeText(trimmedJSX);
      setIsCopied(true);
      toast.success("Code Copied");
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Early return if no code is found
  if (!code) {
    return <div>No Code Generated</div>;
  }

  const trimmedJSX = code.replace('jsx', '').replaceAll('```', '');

  return (
    <div className="p-6 w-full">
      <div className="mt-6">
        <h2 className="text-lg font-medium">
          {preview ? (
            <div className='text-center mb-10 text-3xl font-semibold text-orange-600'>
              Live Preview
            </div>
          ) : (
            <div className='text-center mb-10 text-3xl font-semibold text-orange-600'>
              Generated JSX Code
            </div>
          )}
        </h2>
        <div className="relative overflow-hidden rounded-lg">
          <pre className="bg-orange-200 text-orange-800 p-4 overflow-x-auto whitespace-pre-wrap break-words relative">
            {preview ? (
              <div className='mt-10'>
                <SeeLivePreview code={trimmedJSX} />
              </div>
            ) : (
              <div className='mt-10'>
                <LiveProvider code={trimmedJSX}>
                  <LiveEditor disabled />
                </LiveProvider>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                onClick={handlePreview}
                className="bg-white text-orange-800 px-3 py-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {preview ? (
                  <div className='flex gap-2 items-center'>
                    Go to Code
                    <ArrowRight />
                  </div>
                ) : (
                  <div className='flex gap-2 items-center'>
                    Go to Live Preview
                    <ArrowRight />
                  </div>
                )}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={preview}
                className="bg-white text-orange-800 px-3 py-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </pre>
        </div>
        <Button
          onClick={() => router.push("/")}
          className={`mt-6 md:mt-10 text-lg md:px-8 md:py-6 font-semibold mx-auto bg-orange-600 hover:bg-orange-600 flex items-center
          ${
            theme === "dark"
              ? "text-white/90"
              : "text-black/60"
          }`}
        >
          Generate More ✨
          <FaArrowRightLong className="text-xl md:text-4xl" />
        </Button>
      </div>
    </div>
  );
};

export default GeneratedCode;