'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const getTotalCredits = async () => {
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
    throw new Error("Complete the onboarding process")
  }

  return existingUser.totalCredits ?? 0

}

export default getTotalCredits