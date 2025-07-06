"use client";
import React from "react";
import PaymentOptionSelector from "@components/payment/PaymentOptionSelector";
import Script from "next/script";

const PaymentPage: React.FC = () => {
  return (
    <>
      <PaymentOptionSelector />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default PaymentPage;
