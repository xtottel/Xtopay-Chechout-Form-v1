// MobileMoneyForm.tsx
"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Phone, ChevronDown } from "lucide-react";
import OTPForm from "./OTPForm";
import StatusModal from "./StatusModal";

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

  const sendOTP = async () => {
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }
// If the OTP is sent successfully, show the OTP form
      setShowOTP(true);
      return await response.json();
    } catch (error) {
      console.error("OTP sending error:", error);
      throw error;
    }
  };

  const completePaymentWithOTP = async (otp: string) => {
    try {
      const response = await fetch("/api/payment/initiate/momo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          network: formData.network,
          otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Payment error:", error);
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
      await sendOTP();
      onPaymentInitiated();
      setShowOTP(true);
    } catch (error) {
      // setModalStatus({
      //   isOpen: true,
      //   status: "failed",
      //   title: "OTP Failed",
      //   description:
      //     error instanceof Error ? error.message : "Failed to send OTP",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    try {
      const paymentResponse = await completePaymentWithOTP(otp);

      if (paymentResponse.success) {
        setModalStatus({
          isOpen: true,
          status: "success",
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
        onPaymentComplete();
      } else {
        setModalStatus({
          isOpen: true,
          status: "failed",
          title: "Payment Failed",
          description: paymentResponse.message || "Payment failed",
        });
      }
    } catch (error) {
      setModalStatus({
        isOpen: true,
        status: "failed",
        title: "Payment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Payment failed. Please try again.",
      });
    }
  };

  const handleOTPResend = async () => {
    try {
      await sendOTP();
    } catch (error) {
      setModalStatus({
        isOpen: true,
        status: "failed",
        title: "OTP Failed",
        description: "Failed to resend OTP. Please try again.",
      });
    }
  };

  const closeModal = () => {
    setModalStatus((prev) => ({ ...prev, isOpen: false }));
  };

  
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors ${
                isLoading
                  ? "bg-[#513b7e] opacity-70 cursor-not-allowed"
                  : "bg-[#513b7e] hover:bg-[#3d2c5f]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Pay with Mobile Money"
              )}
            </button>
          </div>
        </form>
      ) : (
        <OTPForm
          onComplete={handleOTPComplete}
          onResend={handleOTPResend}
          recipient={formData.phoneNumber.slice(-2)}
        />
      )}
      <StatusModal {...modalStatus} onClose={closeModal} />
    </div>
  );
};

export default MobileMoneyForm;
