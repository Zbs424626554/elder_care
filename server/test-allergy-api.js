const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAllergyAPI() {
  try {
    console.log('测试过敏史接口...');
    
    // 测试添加过敏史
    const response = await axios.post(`${BASE_URL}/elderhealth/allergies`, {
      item: '花生过敏'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        elderId: '507f1f77bcf86cd799439011' // 测试用的 elderId
      }
    });
    
    console.log('添加过敏史响应:', response.data);
    
    // 测试获取健康档案
    const archiveResponse = await axios.get(`${BASE_URL}/elderhealth/me`, {
      params: {
        elderId: '507f1f77bcf86cd799439011'
      }
    });
    
    console.log('获取健康档案响应:', archiveResponse.data);
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

testAllergyAPI(); 