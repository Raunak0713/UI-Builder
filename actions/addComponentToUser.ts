'use server'

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface addComponentToUserProps {
  code: string;
  prompt: string | null // Make prompt nullable since it comes from searchParams
}

const addComponentToUser = async ({ code, prompt }: addComponentToUserProps): Promise<string> => {
  try {
    if (!code || !prompt) {
      throw new Error("Code and prompt are required");
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      throw new Error("User email not found");
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      throw new Error("Complete the onboarding first");
    }

    // Clean and validate data before passing to Prisma
    const cleanCode = code.trim();
    const cleanPrompt = prompt.trim();

    // Create component with validated data
    await prisma.component.create({
      data: {
        prompt: cleanPrompt,
        jsxCode: cleanCode,
        userId: existingUser.id
      }
    });

    return "created";
  } catch (error: any) {
    // Always throw the error so the client can handle it
    throw new Error(error.message || "Failed to create component");
  }
};

export default addComponentToUser;