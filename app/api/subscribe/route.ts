import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, campaign = 'general' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists for this campaign
    const subscribersCol = collection(db, 'subscribers');
    const q = query(
      subscribersCol,
      where('email', '==', email.toLowerCase()),
      where('campaign', '==', campaign)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { message: 'Already subscribed', alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Add new subscriber
    const docRef = await addDoc(subscribersCol, {
      email: email.toLowerCase(),
      campaign,
      subscribedAt: serverTimestamp(),
      confirmed: false,
      metadata: {
        userAgent: request.headers.get('user-agent') || '',
        referer: request.headers.get('referer') || '',
      }
    });

    console.log('New subscriber added:', docRef.id, email, campaign);

    // TODO: Send confirmation email here if needed
    // You can integrate with Resend, SendGrid, or your existing mail service

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed!',
        subscriberId: docRef.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in subscribe API:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
