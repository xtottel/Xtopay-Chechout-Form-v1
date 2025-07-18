// app/api/otp/send/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (Ghanaian format)
    const ghanaPhoneRegex = /^0[235][0-9]{8}$/;
    if (!ghanaPhoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid Ghanaian phone number' },
        { status: 400 }
      );
    }

    const data = JSON.stringify({
      recipient: phoneNumber,
      from: "Xtopay",
      message: "Your verification code is {code}, it expires in {amount} {duration}",
      pinLength: 4,
      pinType: "NUMERIC",
      expiry: {
        amount: 3,
        duration: "minutes"
      },
      maxAmountOfValidationRetries: 3
    });

    const config = {
      method: 'post',
      url: 'https://api.kairosafrika.com/v1/external/generate/otp',
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
      message: 'OTP sent successfully',
      data: response.data
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}