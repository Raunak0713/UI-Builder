'use client';

import getUserComponents from "@/actions/getUserComponents";
import Component from "@/types/component";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LiveEditor, LiveProvider } from "react-live";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useTheme } from "next-themes";

const ComponentPage = () => {
  const [components, setComponents] = useState<Component[]>([]); // Initialize as an empty array
  const { user } = useUser();
  const { theme } = useTheme()
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const getComponents = async () => {
      if (user) {
        try {
          const comp = await getUserComponents();
          if (comp === undefined) { // Check if comp is null or undefined
            console.log("No components found");
            return;
          }
          setComponents(comp); // Update state with fetched components
        } catch (error) {
          console.error("Error fetching components:", error);
          toast.error("Failed to fetch components"); // Provide user feedback
        }
      }
    };

    getComponents(); // Call the function to fetch components
  }, [user]); // Remove getUserComponents from the dependency array

  // Function to handle card click
  const handleCardClick = (componentId: number) => {
    router.push(`/components/${componentId}`); // Redirect to the component details page
  };

  return (
    <div className='flex flex-col mx-auto items-center min-h-screen p-6'>
      <h1 className='text-4xl font-bold mb-8 text-center text-orange-600'>Your Components</h1>
      {components.length > 0 ? (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <div
              key={component.id}
              className={`p-4 rounded-lg shadow-md cursor-pointer hover:bg-orange-400 transition-colors
                 ${
                  theme === "dark"
                    ? "bg-orange-400/50"
                    : "bg-orange-200"
                }`}
              onClick={() => handleCardClick(component.id)} // Add click handler
            >
              <h2 className="text-xl font-semibold mb-4">{component.prompt}</h2>
              <div className="overflow-hidden max-h-40"> {/* Limit the height for preview */}
                <LiveProvider code={component.jsxCode}>
                  <LiveEditor disabled className="text-sm" /> {/* Smaller text for preview */}
                </LiveProvider>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No components found.</p>
      )}
    </div>
  );
};

export default ComponentPage;