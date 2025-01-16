'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const getUserComponents = async () => {
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

  const comp = await prisma.component.findMany({
    where : {
      userId : existingUser.id
    },
    orderBy : {
      createdAt : 'desc'
    }
  })

  return comp
}

export default getUserComponents