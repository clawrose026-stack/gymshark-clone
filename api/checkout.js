// Vercel Serverless Function for Yoco Checkout
import https from 'https';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Read body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { amount, reference } = JSON.parse(body || '{}');
      
      if (!amount) {
        res.status(400).json({ error: 'Amount required' });
        return;
      }

      const secretKey = process.env.YOCO_SECRET_KEY?.trim();
      if (!secretKey) {
        res.status(500).json({ error: 'YOCO_SECRET_KEY not configured' });
        return;
      }

      const amountInCents = parseInt(amount);
      if (!amountInCents || amountInCents < 200) {
        res.status(400).json({ error: 'Amount must be at least 200 cents' });
        return;
      }

      const externalId = `order${Date.now()}`;
      const siteUrl = 'https://gymshark-clone-zeta.vercel.app';

      const requestBody = JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
        externalId: externalId,
        successUrl: `${siteUrl}/?payment=success&ref=${reference || externalId}`,
        cancelUrl: `${siteUrl}/checkout`
      });

      const options = {
        hostname: 'payments.yoco.com',
        path: '/api/checkouts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const yocoReq = https.request(options, (yocoRes) => {
        let data = '';
        yocoRes.on('data', chunk => data += chunk);
        yocoRes.on('end', () => {
          try {
            const responseData = JSON.parse(data);
            if (yocoRes.statusCode === 200 || yocoRes.statusCode === 201) {
              res.status(200).json({ redirectUrl: responseData.redirectUrl });
            } else {
              res.status(yocoRes.statusCode).json({ 
                error: responseData.message || 'Yoco API error' 
              });
            }
          } catch (e) {
            res.status(500).json({ error: 'Invalid response from Yoco' });
          }
        });
      });

      yocoReq.on('error', (err) => {
        res.status(500).json({ error: 'Request failed: ' + err.message });
      });

      yocoReq.write(requestBody);
      yocoReq.end();

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
