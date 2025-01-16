'use client';
import getUserComponent from '@/actions/getUserComponent';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ComponentViewPage = () => {
  const params = useParams();
  const compId = params.componentId;
  const { user } = useUser()
  const [compFromDatabase, setCompFromDatabase] = useState()

  useEffect(() => {
    if(user){
      const getComp = async () => {
        try {
          // const result = await getUserComponent(compId)
          // setCompFromDatabase(result)
        } catch (error) {
          console.log("Error getting component")
        }
      }
      getComp()
    }
  }, [user])

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='relative w-full max-w-4xl h-full'>
        
        <div className='absolute left-1/2 top-0 bottom-0 w-px border-1 bg-gray-500/40 transform -translate-x-1/2'></div>
      </div>
    </div>
  );
};

export default ComponentViewPage;