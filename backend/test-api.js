const axios = require('axios');

const testAPI = async () => {
  try {
    // Test health endpoint
    console.log('🔍 Testing Health Endpoint...');
    const health = await axios.get('http://localhost:3001/health');
    console.log('✅ Health:', health.data);
    
    // Test user registration
    console.log('\n🔍 Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'citizen'
    };
    
    const register = await axios.post('http://localhost:3001/api/auth/register', registerData);
    console.log('✅ Registration:', register.data);
    
    // Test user login
    console.log('\n🔍 Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: '123456'
    };
    
    const login = await axios.post('http://localhost:3001/api/auth/login', loginData);
    console.log('✅ Login:', login.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
};

testAPI();
