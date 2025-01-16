'use server'

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const putUserInDatabase = async () => {
  const user = await currentUser()

  if(!user){
    throw new Error("User is not authorized ❌")
  }

  const existingUser = await prisma.user.findUnique({
    where : {
      email : user.emailAddresses[0].emailAddress
    }
  })

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

  if(!existingUser){
    await prisma.user.create({
      data : {
        clerkId : user.id,
        name : fullName,
        email : user.emailAddresses[0].emailAddress,
        totalCredits : 10,
      }
    })
  }

  return redirect("/")
}

export default putUserInDatabase