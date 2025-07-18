// types/otp.d.ts
declare interface OTPSendResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    recipient: string;
    // Add other response fields from Kairos API
  };
  error?: string;
}


// types/otp.d.ts (update existing or create new)
declare interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    valid: boolean;
    recipient: string;
    // Add other response fields from Kairos API
  };
  error?: string;
}