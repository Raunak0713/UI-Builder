import ScrollToTop from '@/components/ScrollToTop'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
    <div>
      <ScrollToTop />
      <SignIn />
    </div>
  )
}