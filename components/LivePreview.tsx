import React from 'react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';

interface SeeLivePreviewProps {
  code: string; // Explicitly define the type for the `code` prop
}

const SeeLivePreview = ({ code }: SeeLivePreviewProps) => {
  const cleanCode = code
    .replace(/[\s\S]*import\s+.*from\s+['"].*['"];?\s*/g, '') // Remove import statements
    .replace(/\s*export\s+default\s+[\w]+;?\s*/g, '') // Remove export line
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/interface\s+[\w]+\s*{[\s\S]*?}\s*/g, '') // Remove TypeScript interfaces
    .replace(/[\w]+\.propTypes\s*=\s*{[\s\S]*?};\s*/g, '') // Remove prop-types
    .trim(); // Trim leading/trailing whitespace

  return (
    <LiveProvider code={cleanCode}>
      <div className="flex justify-center">
        <LivePreview className="bg-white p-4 mb-9 rounded-lg shadow-md" />
      </div>
      <LiveError className="text-red-500 bg-red-100 p-2 rounded-md mt-2" />
    </LiveProvider>
  );
};

export { SeeLivePreview };