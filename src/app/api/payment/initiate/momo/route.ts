// app/api/payment/initiate/momo/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, network, otp } = await request.json();

    if (!phoneNumber || !network || !otp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly simulate success (80%) or failure (20%)
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Payment completed successfully',
        transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          message: "Payment failed - OTP verification unsuccessful"
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}