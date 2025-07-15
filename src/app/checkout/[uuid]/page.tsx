// src/app/checkout/[uuid]/page.tsx
import PaymentOptionSelector from '@components/payment/PaymentOptionSelector'
import { notFound } from 'next/navigation'
import Script from 'next/script'

interface PageProps {
  params: { uuid: string }
}

export default async function PaymentPage({ params }: PageProps) {
  const { uuid } = params

  // Validate the checkout session exists
  const session = await fetchCheckoutDetails(uuid)

  if (!session) {
    notFound()
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
      `${process.env.API_BASE_URL}/checkout/details/${uuid}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching checkout details:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'