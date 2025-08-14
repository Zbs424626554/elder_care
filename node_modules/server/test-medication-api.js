const axios = require("axios");

const BASE_URL = "http://localhost:3001/api";

async function testMedicationAPI() {
  try {
    console.log("测试用药时间设置接口...");

    // 测试添加用药时间设置
    const response = await axios.post(
      `${BASE_URL}/elderhealth/medication`,
      {
        name: "阿司匹林",
        time: "08:00",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          elderId: "507f1f77bcf86cd799439011", // 测试用的 elderId
        },
      }
    );

    console.log("添加用药时间设置响应:", response.data);

    // 测试获取健康档案
    const archiveResponse = await axios.get(`${BASE_URL}/elderhealth/me`, {
      params: {
        elderId: "507f1f77bcf86cd799439011",
      },
    });

    console.log("获取健康档案响应:", archiveResponse.data);

    // 测试添加第二个用药时间设置
    const response2 = await axios.post(
      `${BASE_URL}/elderhealth/medication`,
      {
        name: "维生素D",
        time: "20:00",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          elderId: "507f1f77bcf86cd799439011",
        },
      }
    );

    console.log("添加第二个用药时间设置响应:", response2.data);
  } catch (error) {
    console.error("测试失败:", error.response?.data || error.message);
  }
}

testMedicationAPI();
