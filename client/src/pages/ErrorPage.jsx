import { NotFound } from '@/components/ui/ghost-404-page'
import React from 'react'

const ErrorPage = () => {
  return (
    <div>
         <div className="min-h-screen w-full ">
      <NotFound />
    </div>
    </div>
  )
}

export default ErrorPage
