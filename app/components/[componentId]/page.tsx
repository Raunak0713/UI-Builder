'use client';

import getUserComponent from '@/actions/getUserComponent';
import Component from '@/types/component';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LiveEditor, LivePreview, LiveProvider } from 'react-live';
import { toast } from 'sonner';
import { Clipboard } from 'lucide-react'

const ComponentViewPage = () => {
  const params = useParams();
  const compId = params.componentId; 
  const { user } = useUser();
  const [componentFromDatabase, setComponentFromDatabase] = useState<Component | null>(null);

  useEffect(() => {
    if (user && compId) {
      const getComp = async () => {
        try {
          const result = await getUserComponent({ compId: Number(compId) });

          if (result === "YouCantSeeMe") {
            toast.error("You can only view your own components ❌");
            return;
          }

          setComponentFromDatabase(result);
        } catch (error: any) {
          toast.error(error.message || "Error fetching component ❌");
        }
      };
      getComp();
    }
  }, [user, compId]);

  const handleCopy = () => {
    if (componentFromDatabase?.jsxCode) {
      navigator.clipboard.writeText(componentFromDatabase.jsxCode);
      toast.success("Code copied to clipboard ✅");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="relative w-full max-w-6xl h-full flex border border-gray-400 rounded-lg shadow-lg">
        
        {/* Left Side - Scrollable Dark-Themed Editor */}
        <div className="w-1/2 p-4 bg-gray-900 border-r border-gray-400 relative">
          {componentFromDatabase ? (
            <LiveProvider code={componentFromDatabase.jsxCode}>
              <div className="h-[770px] overflow-auto border border-gray-700 rounded-lg p-2 bg-black text-green-300 relative">
                
                {/* Copy Button */}
                <button 
                  onClick={handleCopy} 
                  className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                >
                  <Clipboard className="w-5 h-5" />
                </button>

                <LiveEditor disabled className="w-full outline-none" />
              </div>
            </LiveProvider>
          ) : (
            <p className="text-center text-gray-400 flex items-center justify-center -mt-8 h-screen">Loading Component...</p>
          )}
        </div>

        {/* Right Side - Empty Space or Placeholder */}
        <div className="w-1/2 p-4 flex items-center justify-center bg-white dark:bg-black">
          <p>
            {componentFromDatabase ? (
              <LiveProvider code={componentFromDatabase.jsxCode}>
                <LivePreview />
              </LiveProvider>
            ) : (
              <div className='text-gray-500 dark:text-gray-400 flex items-center justify-center h-screen'>
                Preview or Additional Content
              </div>
            )}
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-500/30 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default ComponentViewPage;
