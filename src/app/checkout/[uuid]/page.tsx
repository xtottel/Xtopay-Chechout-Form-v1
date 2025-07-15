
"use client";
import React from "react";
import PaymentOptionSelector from "@components/payment/PaymentOptionSelector";
import Script from "next/script";
import { useParams } from "next/navigation";


const PaymentPage: React.FC = () => {
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;

  return (
    <>
      <PaymentOptionSelector uuid={uuid} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default PaymentPage;


// import PaymentOptionSelector from "@components/payment/PaymentOptionSelector";
// import { notFound } from "next/navigation";

// interface PageProps {
//   params: { uuid: string };
// }

// export default async function PaymentPage({ params }: PageProps) {
//   const { uuid } = params;

//   // Simulate a fetch
//   const session = await fetchCheckout(uuid); // You can connect this to your API

//   if (!session) {
//     notFound(); // Show 404 page
//   }

//   return <PaymentOptionSelector uuid={uuid} />;
// }

// async function fetchCheckout(uuid: string) {
//   const res = await fetch(`${process.env.API_BASE_URL}/checkout/${uuid}`, {
//     cache: "no-store",
//   });
//   if (!res.ok) return null;
//   return res.json();
// }
