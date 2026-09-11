'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

function Page() {

  const router = useRouter()
  return (
    <div className="flex items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-1 border  p-2 ">
        <div className="h-40 w-50 bg-gray-200 rounded" />
        <Button onClick={() => router.push('/compress')}>Image Compressor</Button>
      </div>
      <div className="flex flex-col gap-1 border  p-2 ">
        <div className="h-40 w-50 bg-gray-200 rounded" />
        <Button onClick={() => router.push('/pdf-organizer')}>PDF Tool</Button>
      </div>
    </div>
  )
}

export default Page