
// src/app/[uuid]/page.tsx
'use client'

import PaymentOptionSelector from '@components/payment/PaymentOptionSelector'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'



export default function PaymentPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionData = await fetchCheckoutDetails(uuid)
        if (!sessionData) {
          notFound()
        }
        // Session data loaded, but not used
        console.error('Error loading session:', Error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [uuid])

  // if (isLoading) {
  //   return <div>Loading...</div> // Or your preferred loading state
  // }

  if (isLoading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fc] text-gray-600">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-[#4a3673] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-base font-medium animate-pulse">Loading payment session...</p>
      </div>
    </div>
  )
}


  return (
    <>
      <PaymentOptionSelector uuid={uuid} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
        strategy="afterInteractive"
      />
    </>
  )
}

async function fetchCheckoutDetails(uuid: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkout/details/${uuid}`,
      { cache: 'no-store' }
    ) 
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching checkout details:', error)
    return null
  }
}

