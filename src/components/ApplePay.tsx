import { useState, useEffect } from 'react';

// Apple Pay types
declare global {
  interface Window {
    ApplePaySession?: any;
  }
}

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: {
    label: string;
    amount: string;
  };
}

interface ApplePayPaymentResponse {
  token: {
    paymentData: string;
    paymentMethod: {
      displayName: string;
      network: string;
      type: string;
    };
    transactionIdentifier: string;
  };
}

interface UseApplePayProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function useApplePay({ amount, onSuccess, onError, onCancel }: UseApplePayProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if Apple Pay is available
  useEffect(() => {
    const checkAvailability = () => {
      if (typeof window === 'undefined') return;
      
      // Check for Apple Pay Session support
      if (window.ApplePaySession && window.ApplePaySession.canMakePayments) {
        const canPay = window.ApplePaySession.canMakePayments();
        setIsAvailable(canPay);
      }
    };

    checkAvailability();
  }, []);

  // Start Apple Pay payment
  const startApplePay = async () => {
    if (!window.ApplePaySession) {
      onError('Apple Pay is not supported on this device');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRequest: ApplePayPaymentRequest = {
        countryCode: 'ZA',
        currencyCode: 'ZAR',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
        total: {
          label: 'GYMSHARK STORE',
          amount: amount.toFixed(2)
        }
      };

      const session = new window.ApplePaySession(14, paymentRequest);

      // Validate merchant
      session.onvalidatemerchant = (_event: any) => {
        // In production, validate with your Apple Pay merchant server
        // For demo, we'll simulate validation
        const merchantSession = {
          epochTimestamp: Date.now(),
          expiresAt: Date.now() + 3600000,
          merchantSessionIdentifier: 'demo-merchant-session',
          nonce: 'demo-nonce',
          merchantIdentifier: 'merchant.com.yourcompany.gymshark',
          domainName: window.location.hostname,
          displayName: 'GYMSHARK STORE',
          signature: 'demo-signature'
        };
        session.completeMerchantValidation(merchantSession);
      };

      // Handle payment authorization
      session.onpaymentauthorized = (event: any) => {
        const payment: ApplePayPaymentResponse = event.payment;
        
        // Extract payment token data
        const paymentData = {
          token: payment.token.paymentData,
          paymentMethod: payment.token.paymentMethod,
          transactionIdentifier: payment.token.transactionIdentifier
        };

        // Complete Apple Pay session
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        
        // Pass payment data to success handler
        onSuccess(paymentData);
      };

      // Handle cancel
      session.oncancel = () => {
        setIsProcessing(false);
        onCancel();
      };

      // Handle errors
      session.onpaymentmethodselected = () => {
        session.completePaymentMethodSelection({});
      };

      // Begin session
      session.begin();

    } catch (error: any) {
      setIsProcessing(false);
      onError(error.message || 'Apple Pay initialization failed');
    }
  };

  return {
    isAvailable,
    isProcessing,
    startApplePay
  };
}

// Apple Pay Button Component
interface ApplePayButtonProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  className?: string;
}

export function ApplePayButton({ 
  amount, 
  onSuccess, 
  onError, 
  onCancel,
  className = '' 
}: ApplePayButtonProps) {
  const { isAvailable, isProcessing, startApplePay } = useApplePay({
    amount,
    onSuccess,
    onError,
    onCancel
  });

  // Only show on iOS Safari or macOS Safari
  if (!isAvailable) return null;

  return (
    <>
      {/* Apple Pay Button */}
      <button
        onClick={startApplePay}
        disabled={isProcessing}
        className={`apple-pay-button ${className}`}
        style={{
          backgroundColor: '#000',
          borderRadius: '8px',
          padding: '12px 24px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          height: '48px',
          fontSize: '16px',
          fontWeight: 500,
          color: '#fff',
          WebkitAppearance: '-apple-pay-button',
          appearance: 'none'
        }}
      >
        <svg width="50" height="20" viewBox="0 0 50 20" fill="none">
          <path d="M9.8 4.5c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8zM11 5.8c-1 0-1.8.6-2.3.6-.5 0-1.3-.6-2.2-.6-1.1 0-2.2.7-2.8 1.7-1.2 2.1-.3 5.2.9 6.9.6.8 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6 1.1 0 1.3.6 2.2.6.9 0 1.5-.8 2.1-1.7.7-.9.9-1.8.9-1.9 0-.1-1.8-.7-1.8-2.6 0-1.6 1.2-2.4 1.3-2.5-.7-1-1.8-1.1-2.2-1.1z" fill="white"/>
          <text x="16" y="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="12" fontWeight="500" fill="white">Pay</text>
        </svg>
      </button>

      {/* Processing Overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            color: '#fff',
            marginTop: '16px',
            fontSize: '16px',
            fontWeight: 500
          }}>
            Processing Payment...
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Backend integration helper
export async function chargeApplePayToken(
  token: string,
  amount: number,
  currency: string = 'ZAR'
): Promise<{ success: boolean; error?: string; chargeId?: string }> {
  try {
    // In production, call your backend endpoint
    const response = await fetch('/api/charge/apple-pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        amountInCents: Math.round(amount * 100),
        currency
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment failed');
    }

    return {
      success: true,
      chargeId: data.chargeId
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default ApplePayButton;
