import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex items-start justify-center h-screen mt-20'>
      {children}
    </div>
  )
}

export default AuthLayout
