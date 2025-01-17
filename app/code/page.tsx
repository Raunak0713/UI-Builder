'use client';
import addComponentToUser from '@/actions/addComponentToUser';
import { SeeLivePreview } from '@/components/LivePreview';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, CirclePlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { LiveEditor, LiveProvider } from 'react-live';
import { toast } from 'sonner';

const GeneratedCode = () => {
  const [preview, setPreview] = useState(false);
  const [code, setCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [componentAdded, setComponentAdded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedNumber, setSavedNumber] = useState(0)
  const router = useRouter();
  const search = useSearchParams();
  const prompt = search.get('prompt');
  const { user } = useUser();
  const { theme } = useTheme();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const generatedCode = localStorage.getItem("generatedCode");
      if (generatedCode) {
        setCode(generatedCode);
        localStorage.removeItem("generatedCode");
      } else {
        console.log("No code found. Please generate a new component.");
      }
    }
  }, [router]);

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleAddComponent = async () => {
    const trimmedJSX = code.replace('jsx','').replaceAll('```','');
    if(!componentAdded){
      try {
        const message = await addComponentToUser({ code : trimmedJSX, prompt });
        if(message === "created"){
          toast.success("Added to your component Library");
        }
        setComponentAdded(true)
      } catch (error) {
        toast.error("Failed to add component to Library")
      }
    }
    else{
      toast.error("Component already added to Library")
      setSavedNumber(prevNumber => prevNumber + 1)
      if(savedNumber > 3){
        setSaved(true)
      }
    }
  }

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
            <div className='text-center mb-10 text-3xl font-semibold text-gray-600'>
              Live Preview
            </div>
          ) : (
            <div className='text-center mb-10 text-3xl font-semibold text-gray-600'>
              Generated JSX Code
            </div>
          )}
        </h2>
        <div className="relative overflow-hidden rounded-lg">
          <pre className="bg--200 text--800 p-4 overflow-x-auto whitespace-pre-wrap break-words relative">
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
            <div className="absolute top-2 right-2 flex gap-2 mr-2">
              <Button 
              disabled={saved}
              onClick={handleAddComponent}
              className={`bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 gap-2 focus:outline-none
                  ${
                    theme === "dark"
                      ? "text-white/90"
                      : "text-black/60"
                  }
              `}>
                Add to Library
                <CirclePlus />
              </Button>
              <Button
                onClick={handlePreview}
                className={`bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none
                  ${
                    theme === "dark"
                      ? "text-white/90"
                      : "text-black/60"
                  }
                `}
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
                className={`bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none
                   ${
                  theme === "dark"
                    ? "text-white/90"
                    : "text-black/60"
                  }
                `}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </pre>
        </div>
        <Button
          onClick={() => router.push("/")}
          className={`mt-6 md:mt-10 text-lg md:px-8 md:py-6 font-semibold mx-auto bg-gray-700 hover:bg-gray-600 flex items-center
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