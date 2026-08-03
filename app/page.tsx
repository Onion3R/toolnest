'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

function Page() {

  const router = useRouter()
  return (
    <div className="flex items-center justify-center h-screen">
    <Button onClick={() => router.push('/compress')}>Image Compressor</Button>
    </div>
  )
}

export default Page