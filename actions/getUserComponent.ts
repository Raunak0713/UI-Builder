'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

interface getUserComponentProps {
  compId : number;
}

const getUserComponent = async ({ compId } : getUserComponentProps ) => {
  const user = await currentUser()

  if(!user){
    throw new Error("User is not authorized ❌")
  }

  const existingUser = await prisma.user.findUnique({
    where : {
      email : user.emailAddresses[0].emailAddress
    }
  })

  if(!existingUser){
    throw new Error("Complete the onboarding first")
  }


}

export default getUserComponent