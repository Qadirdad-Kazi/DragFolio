#!/usr/bin/env node
/**
 * Verification script to check if the Netlify deployment is working
 * Run after setting VITE_API_URL and redeploying
 */

const FRONTEND_URL = 'https://dragfolio.netlify.app';
const BACKEND_URL = 'https://drag-folio-five.vercel.app';

async function verifyDeployment() {
  console.log('\n🔍 Verifying DragFolio Deployment\n');
  console.log('='.repeat(50));

  let allPassed = true;

  // Test 1: Check if frontend is accessible
  console.log('\n1️⃣  Checking frontend accessibility...');
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('   ✅ Frontend is accessible');
    } else {
      console.log(`   ❌ Frontend returned ${response.status}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Frontend not accessible:', error.message);
    allPassed = false;
  }

  // Test 2: Check if backend is accessible
  console.log('\n2️⃣  Checking backend API health...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    if (response.ok && data.status === 'ok') {
      console.log('   ✅ Backend API is healthy');
    } else {
      console.log('   ❌ Backend API health check failed');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Backend not accessible:', error.message);
    allPassed = false;
  }

  // Test 3: Check backend database connection
  console.log('\n3️⃣  Checking database connection...');
  try {
    const response = await fetch(`${BACKEND_URL}/`);
    const data = await response.json();
    if (data.dbStatus === 'connected') {
      console.log('   ✅ Database is connected');
    } else {
      console.log(`   ⚠️  Database status: ${data.dbStatus}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Could not check database:', error.message);
    allPassed = false;
  }

  // Test 4: Test registration endpoint
  console.log('\n4️⃣  Testing registration endpoint...');
  try {
    const testEmail = `verify${Date.now()}@test.com`;
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Test123!@#',
        name: 'Verification Test'
      })
    });

    if (response.status === 201) {
      console.log('   ✅ Registration endpoint works');
    } else {
      const error = await response.text();
      console.log(`   ❌ Registration failed: ${response.status}`);
      console.log(`   Error: ${error}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Registration test failed:', error.message);
    allPassed = false;
  }

  // Test 5: Check CORS
  console.log('\n5️⃣  Checking CORS configuration...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
    if (allowOrigin === FRONTEND_URL || allowOrigin === '*') {
      console.log('   ✅ CORS is configured correctly');
    } else {
      console.log(`   ⚠️  CORS might have issues. Allow-Origin: ${allowOrigin}`);
    }
  } catch (error) {
    console.log('   ❌ CORS check failed:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('\n🎉 ALL CHECKS PASSED!\n');
    console.log('Your deployment is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Make sure VITE_API_URL is set in Netlify');
    console.log('2. Redeploy your frontend on Netlify');
    console.log('3. Test registration at: ' + FRONTEND_URL + '/register');
  } else {
    console.log('\n⚠️  SOME CHECKS FAILED\n');
    console.log('Review the errors above and:');
    console.log('1. Verify environment variables are set correctly');
    console.log('2. Check Netlify and Vercel deployment logs');
    console.log('3. Ensure database connection string is valid');
  }
  console.log('\n' + '='.repeat(50) + '\n');
}

// Run verification
verifyDeployment().catch(console.error);

