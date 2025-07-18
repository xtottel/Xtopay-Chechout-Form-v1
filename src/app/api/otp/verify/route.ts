// app/api/otp/verify/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { code, phoneNumber } = await request.json();

    if (!code || !phoneNumber) {
      return NextResponse.json(
        { error: 'Both code and phone number are required' },
        { status: 400 }
      );
    }

    // Validate code format (4 digits)
    const codeRegex = /^\d{4}$/;
    if (!codeRegex.test(code)) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    // Validate phone number format (Ghanaian format)
    const ghanaPhoneRegex = /^0[235][0-9]{8}$/;
    if (!ghanaPhoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const data = JSON.stringify({
      code,
      recipient: phoneNumber
    });

    const config = {
      method: 'post',
      url: 'https://api.kairosafrika.com/v1/external/validate/otp',
      headers: { 
        'x-api-key': process.env.NEXT_PUBLIC_KAIROS_API_KEY || '', 
        'x-api-secret': process.env.NEXT_PUBLIC_KAIROS_API_SECRET || '', 
        'Content-Type': 'application/json'
      },
      data
    };

    const response = await axios(config);
    
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: response.data
    });

  } catch (error: unknown) {
    console.error('Error verifying OTP:', error);

    let errorMessage = 'Failed to verify OTP';
    let statusCode = 500;

    interface AxiosErrorWithResponse {
      response?: {
        status?: number;
        [key: string]: unknown;
      };
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as AxiosErrorWithResponse).response === 'object' &&
      (error as AxiosErrorWithResponse).response !== null
    ) {
      const response = (error as AxiosErrorWithResponse).response;
      // Handle API-specific errors
      if (response?.status === 400) {
        errorMessage = 'Invalid OTP code';
        statusCode = 400;
      } else if (response?.status === 404) {
        errorMessage = 'OTP expired or not found';
        statusCode = 404;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}