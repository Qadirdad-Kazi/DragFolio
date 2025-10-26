/**
 * Test registration from frontend perspective
 * This simulates what the Netlify frontend is sending
 */

const API_URL = 'https://drag-folio-five.vercel.app';

async function testFrontendRegistration() {
  console.log('🧪 Testing Registration from Frontend Perspective\n');
  console.log('API URL:', API_URL);
  console.log('='.repeat(60));

  // Test with the exact same data format the frontend sends
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test123456!',
    name: 'Test User'
  };

  console.log('\n📤 Sending registration request...');
  console.log('Data:', JSON.stringify(testUser, null, 2));

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://dragfolio.netlify.app'
      },
      body: JSON.stringify(testUser)
    });

    console.log('\n📥 Response Status:', response.status, response.statusText);
    console.log('Response Headers:');
    console.log('  Content-Type:', response.headers.get('content-type'));
    console.log('  CORS Origin:', response.headers.get('access-control-allow-origin'));

    const responseText = await response.text();
    console.log('\n📄 Response Body:');
    
    try {
      const data = JSON.parse(responseText);
      console.log(JSON.stringify(data, null, 2));

      if (response.status === 400) {
        console.log('\n❌ 400 ERROR DETAILS:');
        if (data.message) {
          console.log('   Message:', data.message);
        }
        if (data.errors) {
          console.log('   Validation Errors:');
          data.errors.forEach(err => {
            console.log(`     - ${err.path?.join('.')}: ${err.message}`);
          });
        }
      } else if (response.status === 201) {
        console.log('\n✅ Registration successful!');
      }
    } catch (e) {
      console.log(responseText);
    }

  } catch (error) {
    console.error('\n💥 Request Failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));

  // Now test if that email already exists
  console.log('\n🔄 Testing with existing email...\n');
  
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://dragfolio.netlify.app'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.status === 400 && data.message === 'User already exists') {
      console.log('\n✅ This is expected - user already exists');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 TROUBLESHOOTING:\n');
  console.log('If you\'re getting 400 errors on the frontend:');
  console.log('1. Check browser console for the actual error message');
  console.log('2. Open Network tab in DevTools and inspect the /register request');
  console.log('3. Look at the Response tab to see the detailed error');
  console.log('4. Common 400 causes:');
  console.log('   - Email already exists');
  console.log('   - Password too short (minimum 6 characters)');
  console.log('   - Invalid email format');
  console.log('   - Missing name field (though it\'s optional)');
}

testFrontendRegistration().catch(console.error);

