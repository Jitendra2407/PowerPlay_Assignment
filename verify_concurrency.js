const axios = require('axios');

const testConcurrency = async () => {
  const url = 'http://localhost:5000/reservations';
  // Use a different partnerId to avoid confusion in logs, but simpler to just run it.
  const data = { partnerId: 'test-partner', seats: 1 };

  console.log('--- Starting Concurrency Test ---');
  console.log('Simulating 2 concurrent booking requests...');

  try {
    // Fire two requests simultaneously
    const p1 = axios.post(url, data);
    const p2 = axios.post(url, data);

    const results = await Promise.allSettled([p1, p2]);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Request ${index + 1}: SUCCESS (201 Created)`);
        console.log(`  Reservation ID: ${result.value.data.reservationId}`);
      } else {
        const status = result.reason.response ? result.reason.response.status : 'Unknown';
        const message = result.reason.response ? result.reason.response.data.message : result.reason.message;
        console.log(`Request ${index + 1}: FAILED (${status})`);
        console.log(`  Reason: ${message}`);
      }
    });
    
    console.log('--- Test Complete ---');
    console.log('Expected Behavior: One request should succeed (201), the other should fail (409) due to version mismatch.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

testConcurrency();
