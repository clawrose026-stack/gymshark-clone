# Apple Pay + Yoco Backend Integration

## Overview
This document outlines the backend implementation required to process Apple Pay payments through Yoco's payment gateway.

## API Endpoint

### POST /api/charge/apple-pay

Processes an Apple Pay payment token through Yoco.

#### Request Body

```json
{
  "token": "base64-encoded-payment-data",
  "paymentMethod": {
    "displayName": "MasterCard 4242",
    "network": "MasterCard",
    "type": "credit"
  },
  "transactionIdentifier": "unique-transaction-id",
  "amountInCents": 11500,
  "currency": "ZAR"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "chargeId": "charge_abc123",
  "status": "successful",
  "amount": 11500,
  "currency": "ZAR"
}
```

**Error (400/500)**
```json
{
  "success": false,
  "error": "Payment failed: Insufficient funds"
}
```

## Backend Implementation (Node.js/Express Example)

```javascript
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Yoco API configuration
const YOCO_API_URL = 'https://online.yoco.com/v1';
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY; // Your Yoco secret key

/**
 * Charge Apple Pay token via Yoco
 */
router.post('/charge/apple-pay', async (req, res) => {
  try {
    const {
      token,
      paymentMethod,
      transactionIdentifier,
      amountInCents,
      currency
    } = req.body;

    // Validate required fields
    if (!token || !amountInCents) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: token, amountInCents'
      });
    }

    // Step 1: Tokenize the Apple Pay payment data with Yoco
    // Note: Yoco may require you to convert Apple Pay token to their format
    // This example assumes direct tokenization
    
    const tokenResponse = await axios.post(
      `${YOCO_API_URL}/tokens`,
      {
        paymentData: token,
        paymentMethod: paymentMethod,
        transactionIdentifier: transactionIdentifier
      },
      {
        headers: {
          'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const yocoToken = tokenResponse.data.id;

    // Step 2: Create charge using the token
    const chargeResponse = await axios.post(
      `${YOCO_API_URL}/charges`,
      {
        token: yocoToken,
        amountInCents: amountInCents,
        currency: currency || 'ZAR',
        metadata: {
          paymentMethod: 'apple_pay',
          transactionIdentifier: transactionIdentifier
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return success
    res.json({
      success: true,
      chargeId: chargeResponse.data.id,
      status: chargeResponse.data.status,
      amount: amountInCents,
      currency: currency
    });

  } catch (error) {
    console.error('Apple Pay charge error:', error);
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Payment processing failed'
    });
  }
});

module.exports = router;
```

## Environment Variables

```bash
# Yoco Configuration
YOCO_SECRET_KEY=sk_live_your_secret_key_here
YOCO_PUBLIC_KEY=pk_live_your_public_key_here

# Apple Pay Merchant
APPLE_PAY_MERCHANT_ID=merchant.com.yourcompany.app
APPLE_PAY_MERCHANT_CERTIFICATE_PATH=/path/to/certificate.pem
APPLE_PAY_MERCHANT_KEY_PATH=/path/to/private-key.key
```

## Apple Pay Merchant Setup

### 1. Register Merchant ID
- Go to Apple Developer Portal
- Create Merchant ID: `merchant.com.yourcompany.app`
- Enable Apple Pay Processing

### 2. Create Payment Processing Certificate
- In Apple Developer Portal, create CSR
- Upload to Yoco Dashboard to get Apple Pay certificate
- Download and install certificate

### 3. Verify Domain
- Upload verification file to your domain
- Verify in Apple Developer Portal

## Security Considerations

1. **Never store Apple Pay tokens** - They are single-use only
2. **Use HTTPS** for all payment endpoints
3. **Validate merchant session** before completing payment
4. **Implement idempotency** for charge requests
5. **Log all transactions** for audit purposes

## Testing

### Test Cards (Sandbox)
Apple Pay test cards are available in Apple Developer Portal for testing various scenarios:
- Successful payment
- Declined payment
- Insufficient funds
- Invalid CVV

### Yoco Test Mode
Use Yoco test keys (`pk_test_`, `sk_test_`) for integration testing.

## Flow Summary

1. **Frontend**: User taps Apple Pay button
2. **Frontend**: Apple Pay sheet opens, user authenticates with Face ID/Touch ID
3. **Frontend**: Encrypted payment token generated
4. **Frontend**: Token sent to `/api/charge/apple-pay`
5. **Backend**: Tokenize with Yoco
6. **Backend**: Create charge with Yoco
7. **Backend**: Return success/failure to frontend
8. **Frontend**: Complete Apple Pay session with status
9. **Frontend**: Show success screen (bypassing Step 3)

## Error Handling

| Error Code | Description | User Message |
|------------|-------------|--------------|
| `payment_failed` | Generic payment failure | "Payment failed. Please try again." |
| `insufficient_funds` | Card declined | "Your card was declined. Please try a different payment method." |
| `invalid_token` | Token expired/invalid | "Payment session expired. Please try again." |
| `network_error` | Connection issue | "Network error. Please check your connection and try again." |

## Support

- Yoco API Docs: https://developer.yoco.com/
- Apple Pay Docs: https://developer.apple.com/apple-pay/
- Yoco Support: support@yoco.com
