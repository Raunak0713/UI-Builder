'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

interface getUserComponentProps {
  compId : number;
}

const getUserComponent = async ({ compId } : getUserComponentProps ) => {
  const user = await currentUser();
  
  if(!user){
    throw new Error("User is not authorized ❌")
  }
  
  const userEmail = user?.emailAddresses[0].emailAddress;
  
  const existingUser = await prisma.user.findUnique({
    where : {
      email : userEmail
    }
  })

  if(!existingUser){
    throw new Error("Complete the onboarding first")
  }

  const component = await prisma.component.findUnique({
    where : {
      id : compId
    }
  })

  if(!component){
    throw new Error("Component does not exist")
  }

  if(component.userId !== existingUser.id){
    return "YouCantSeeMe"
  }

  return component

}

export default getUserComponent