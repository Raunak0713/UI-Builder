import ScrollToTop from '@/components/ScrollToTop'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <div>
      <ScrollToTop />
      <SignUp />
    </div>
  )
}