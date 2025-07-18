// OTPForm.tsx
"use client";
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface OTPVerificationFormProps {
  onComplete: (otp: string) => void;
  onResend: () => Promise<void>;
  recipient?: string;
}

const OTPForm: React.FC<OTPVerificationFormProps> = ({
  onComplete,
  onResend,
  recipient = "****45",
}) => {
  const OTP_LENGTH = 4;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit) && newOtp.length === OTP_LENGTH) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .slice(0, OTP_LENGTH);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length && i < OTP_LENGTH; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      if (pasteData.length === OTP_LENGTH) {
        handleSubmit(newOtp.join(""));
      } else {
        inputRefs.current[pasteData.length]?.focus();
      }
    }
  };

  const handleSubmit = async (otpValue: string) => {
    setIsSubmitting(true);
    setError("");
    console.log("Submitting:", {
      code: otpValue,
      phoneNumber: recipient.replace(/\*/g, ""),
    });

    try {
      // Extract just the digits from the recipient (remove any * masking)
      const cleanPhoneNumber = recipient.replace(/\D/g, "");

      // Ensure it's at least 9 digits (Ghana number without leading 0)
      const formattedPhoneNumber =
        cleanPhoneNumber.length >= 9
          ? cleanPhoneNumber.slice(-9)
          : cleanPhoneNumber;

      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: otpValue,
          phoneNumber: `0${formattedPhoneNumber}`, // Add leading 0 for local format
        }),
      });
      console.log("Request sent:", {
        code: otpValue,
        phoneNumber: `0${formattedPhoneNumber}`,
      });
      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        // Provide specific error messages based on status code
        if (response.status === 400) {
          throw new Error("Invalid OTP code or phone number format.");
        } else if (response.status === 404) {
          throw new Error("OTP has expired or was not found.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized access. Invalid credentials.");
        } else {
          throw new Error(
            data.error || "Verification failed. Please try again."
          );
        }
      }

      if (data.success) {
        setSuccess(true);
        onComplete(otpValue);
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown === 0) {
      try {
        await onResend();
        setCountdown(30);
        setError("");
      } catch (err) {
        setError("Failed to resend OTP. Please try again.");
      }
    }
  };

  return (
    <div className="w-full  bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* /rounded-xl border border-gray-200 / */}
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white text-center">
        Verify Payment
      </h2>

      <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>Code sent to your phone ******{recipient}</span>
      </div>

      <div className="mb-6 flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`h-14 w-14 rounded-lg border text-center text-3xl font-bold transition-colors focus:outline-none ${
              error
                ? "border-red-500 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-900/20 dark:text-red-100"
                : success
                  ? "border-green-500 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-900/20 dark:text-green-100"
                  : "border-gray-300 bg-gray-50 text-gray-900 focus:border-[#513b7e] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#7e6b9e]"
            }`}
            disabled={isSubmitting || success}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-center text-sm text-green-500 dark:text-green-400">
          Verification successful!
        </div>
      )}

      <button
        type="button"
        onClick={() => handleSubmit(otp.join(""))}
        disabled={otp.some((d) => !d) || isSubmitting || success}
        className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors ${
          otp.some((d) => !d) || isSubmitting || success
            ? "bg-[#513b7e]/70 cursor-not-allowed"
            : "bg-[#513b7e] hover:bg-[#3d2c5f]"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
            Verifying...
          </span>
        ) : success ? (
          "Verified ✓"
        ) : (
          "Verify & Complete Payment"
        )}
      </button>

      <button
        onClick={handleResend}
        disabled={countdown > 0}
        className={`w-full text-sm text-center p-2.5 flex justify-center items-center transition-colors ${
          countdown > 0
            ? "text-gray-400 dark:text-gray-500"
            : "text-[#513b7e] hover:text-[#3d2c5f] dark:text-[#7e6b9e] dark:hover:text-[#a396c1]"
        }`}
      >
        Didn&apos;t receive the code?{" "}
        {countdown > 0 ? ` (${countdown}s)` : " Resend"}
      </button>
    </div>
  );
};

export default OTPForm;
