'use server'

import { redirect } from "next/navigation"

const routeToCode = async (code : string,prompt : string) => {
  localStorage.setItem("generatedCode", code);
  return redirect(`/code?prompt=${encodeURIComponent(prompt)}`);
}

export default routeToCode
