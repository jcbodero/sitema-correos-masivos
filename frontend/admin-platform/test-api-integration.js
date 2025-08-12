#!/usr/bin/env node

/**
 * Script de prueba para verificar la integración entre el frontend y la API de contactos
 */

const API_BASE_URL = 'http://localhost:8080/api';

async function testApiEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    console.log(`${method} ${endpoint}: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Error:', response.status, response.statusText);
    }
    
    return response.ok;
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing API Integration for Contacts Module\n');
  
  const tests = [
    // Health Check
    { name: 'Health Check', endpoint: '/contacts/health' },
    
    // Contacts CRUD
    { name: 'Get Contacts', endpoint: '/contacts?userId=1&page=0&size=20' },
    { 
      name: 'Create Contact', 
      endpoint: '/contacts', 
      method: 'POST',
      body: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        company: 'Test Company',
        userId: '1'
      }
    },
    
    // Contact Lists
    { name: 'Get Contact Lists', endpoint: '/contacts/lists?userId=1&page=0&size=20' },
    {
      name: 'Create Contact List',
      endpoint: '/contacts/lists',
      method: 'POST',
      body: {
        name: 'Test List',
        description: 'Test list for API integration',
        userId: '1'
      }
    },
    
    // Statistics
    { name: 'Get Contact Stats', endpoint: '/contacts/stats?userId=1' }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n📋 ${test.name}`);
    console.log('─'.repeat(50));
    
    const success = await testApiEndpoint(
      test.endpoint, 
      test.method || 'GET', 
      test.body
    );
    
    if (success) {
      passed++;
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! API integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the API server and endpoints.');
  }
  
  console.log('\n💡 Tips:');
  console.log('- Make sure the API Gateway is running on port 8080');
  console.log('- Make sure the Contact Service is running on port 8082');
  console.log('- Check the database connection and migrations');
  console.log('- Verify CORS configuration in the API Gateway');
}

// Run the tests
runTests().catch(console.error);