"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Phone, ChevronDown } from "lucide-react";
import OTPForm from "./OTPForm";
import StatusModal from "./StatusModal";
//import axios from "axios";

interface MobileMoneyPaymentFormProps {
  onPaymentInitiated: () => void;
  onPaymentComplete: () => void;
}

interface MobileMoneyPaymentData {
  phoneNumber: string;
  network: string;
}

const MobileMoneyForm: React.FC<MobileMoneyPaymentFormProps> = ({
  onPaymentInitiated,
  onPaymentComplete,
}) => {
  const [formData, setFormData] = useState<MobileMoneyPaymentData>({
    phoneNumber: "",
    network: "momo",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    status: "success" | "failed" | "insufficient";
    title: string;
    description: string;
  }>({
    isOpen: false,
    status: "success",
    title: "",
    description: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // const sendOTP = async (phoneNumber: string) => {
  //   try {
  //     const data = JSON.stringify({
  //       recipient: phoneNumber,
  //       from: "Xtopay",
  //       message: "Your verification code is {code}, it expires in {amount} {duration}",
  //       pinLength: 4,
  //       pinType: "NUMERIC",
  //       expiry: {
  //         amount: 3,
  //         duration: "minutes"
  //       },
  //       maxAmountOfValidationRetries: 3
  //     });

  //     const config = {
  //       method: 'post',
  //       url: 'https://api.kairosafrika.com/v1/external/generate/otp',
  //       headers: { 
  //         'x-api-key': 'U2FsdGVkX1+Wcez4iQasGLnRUH49qZis4TkElhslqZI=', 
  //         'x-api-secret': 'ZRwHljsxRrYhvJiIXzwoZpP10457', 
  //         'Content-Type': 'application/json'
  //       },
  //       data
  //     };

  //     const response = await axios(config);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //     throw error;
  //   }
  // };

// Update the sendOTP function in MobileMoneyForm.tsx
const sendOTP = async (phoneNumber: string) => {
  try {
    const response = await fetch('/api/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.phoneNumber || !formData.network) {
      setIsLoading(false);
      return;
    }

    try {
      // First initiate payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPaymentInitiated();
      
      // Then send OTP
      await sendOTP(formData.phoneNumber);
      setShowOTP(true);
    } catch (error) {
      setModalStatus({
        isOpen: true,
        status: "failed",
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (otp: string) => {
    // Here you would typically verify the OTP with your backend
    console.log("OTP verified:", otp);
    setModalStatus({
      isOpen: true,
      status: "success",
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
    onPaymentComplete();
  };

  const handleOTPResend = async () => {
    try {
      await sendOTP(formData.phoneNumber);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const closeModal = () => {
    setModalStatus(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      {!showOTP ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-4">
            {/* Network Select */}
            <div className="col-span-2">
              <label
                htmlFor="network"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Mobile Network*
              </label>
              <div className="relative">
                {/* Left Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Image
                    src={`/brands/${formData.network}.svg`}
                    alt={formData.network}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </div>

                {/* Select Input */}
                <select
                  id="network"
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-[#513b7e] focus:ring-[#513b7e] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#513b7e] dark:focus:ring-[#513b7e]"
                  value={formData.network}
                  onChange={handleChange}
                  required
                >
                  <option value="momo">MTN Mobile Money</option>
                  <option value="telecel">Telecel Cash</option>
                  <option value="at">AT Money</option>
                </select>

                {/* Right Dropdown Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="col-span-2">
              <label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number*
              </label>
              <div className="relative">
                {/* Left Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>

                <input
                  type="tel"
                  id="phoneNumber"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#513b7e] focus:ring-[#513b7e] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#513b7e] dark:focus:ring-[#513b7e]"
                  placeholder="0244123456"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: value,
                    }));
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
              isLoading
                ? 'bg-[#513b7e] opacity-70 cursor-not-allowed'
                : 'bg-[#513b7e] hover:bg-[#3d2c5f] focus:ring-[#7e6b9e] dark:bg-[#513b7e] dark:hover:bg-[#3d2c5f] dark:focus:ring-[#7e6b9e]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay with Mobile Money'
            )}
          </button>
        </form>
      ) : (
        <OTPForm
          onComplete={handleOTPComplete}
          onResend={handleOTPResend}
          recipient={formData.phoneNumber.slice(-2)}
        />
      )}

      <StatusModal
        isOpen={modalStatus.isOpen}
        status={modalStatus.status}
        title={modalStatus.title}
        description={modalStatus.description}
        onClose={closeModal}
        onAction={closeModal}
      />
    </div>
  );
};

export default MobileMoneyForm;