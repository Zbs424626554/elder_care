const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// 测试数据
const testData = {
  user: {
    username: 'testadmin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  review: {
    orderId: '507f1f77bcf86cd799439011',
    reviewerId: '507f1f77bcf86cd799439012',
    revieweeId: '507f1f77bcf86cd799439013',
    rating: 5,
    content: '服务很好，护工很专业'
  },
  complaint: {
    type: 'service',
    title: '服务质量投诉',
    description: '护工服务态度不好，要求改进'
  }
};

// 测试函数
async function testAPI() {
  console.log('开始API测试...\n');

  try {
    // 1. 测试认证接口
    console.log('1. 测试用户注册...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testData.user);
    console.log('注册成功:', registerResponse.data.message);

    // 2. 测试用户登录
    console.log('\n2. 测试用户登录...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: testData.user.username,
      password: testData.user.password
    });
    console.log('登录成功:', loginResponse.data.message);

    const token = loginResponse.data.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };

    // 3. 测试获取评价列表
    console.log('\n3. 测试获取评价列表...');
    const reviewsResponse = await axios.get(`${BASE_URL}/reviews`, { headers });
    console.log('获取评价列表成功:', reviewsResponse.data.message);

    // 4. 测试获取投诉列表
    console.log('\n4. 测试获取投诉列表...');
    const complaintsResponse = await axios.get(`${BASE_URL}/complaints`, { headers });
    console.log('获取投诉列表成功:', complaintsResponse.data.message);

    console.log('\n✅ 所有API测试通过！');

  } catch (error) {
    console.error('\n❌ API测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 