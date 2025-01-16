'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const reduceCredit = async () => {
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

  const credits = existingUser.totalCredits

  if (credits <= 0) {
    throw new Error("No credits available to reduce")
  }

  await prisma.user.update({
    where : {
      clerkId : user.id
    },
    data : {
      totalCredits : credits - 1
    }
  })

  return existingUser.totalCredits
}

export default reduceCredit