export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));

    const { token, payload } = req.body;

    if (!token) {
      console.error('❌ Missing token');
      return res.status(400).json({ error: 'Missing token' });
    }

    if (!payload) {
      console.error('❌ Missing payload');
      return res.status(400).json({ error: 'Missing payload' });
    }

    console.log('📤 Calling Pandago API...');
    console.log('Token:', token.substring(0, 50) + '...');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api-sandbox.deliveryhero.io/pandago/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('✅ Pandago response status:', response.status);

    const data = await response.json();
    console.log('📨 Pandago response:', JSON.stringify(data, null, 2));

    return res.status(response.status).json(data);

  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: error.message,
      details: 'Proxy server error',
      stack: error.stack
    });
  }
}
