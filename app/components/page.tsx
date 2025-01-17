'use client';

import getUserComponents from "@/actions/getUserComponents";
import { Card, CardDescription } from "@/components/ui/card";
import Component from "@/types/component";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveEditor, LiveProvider } from "react-live";
import { toast } from "sonner";

const ComponentPage = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const getComponents = async () => {
      if (user) {
        try {
          const comp = await getUserComponents();
          if (comp === undefined || comp.length === 0) {
            setTimeout(() => setLoading(false), 6000);
            return;
          }
          setComponents(comp);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching components:", error);
          toast.error("Failed to fetch components");
          setLoading(false);
        }
      }
    };

    getComponents(); 
  }, [user]);

  const handleCardClick = (componentId: number) => {
    router.push(`/components/${componentId}`);
  };

  return (
    <div className='flex flex-col mx-auto items-center min-h-screen p-6'>
      <h1 className='text-4xl font-bold mb-8 text-center text--600'>Your Components</h1>

      {loading ? (
        <p className="text-gray-500">Loading components...</p>
      ) : components.length > 0 ? (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <Card
              key={component.id}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-colors`}
              onClick={() => handleCardClick(component.id)}
            >
              
              <CardDescription className="line-clamp-3">
                {component.prompt.split(' ').slice(0, 4).join(' ')}
                {component.prompt.split(' ').length > 4 ? '...' : ''}
              </CardDescription>
              
              <div className="overflow-hidden max-h-40 mt-2">
                <LiveProvider code={component.jsxCode}>
                  <div suppressHydrationWarning>
                    <LiveEditor disabled className="text-sm" />
                  </div>
                </LiveProvider>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No components found.</p>
      )}
    </div>
  );
};

export default ComponentPage;
