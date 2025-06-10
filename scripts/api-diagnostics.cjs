#!/usr/bin/env node

/**
 * API 诊断脚本
 * 用于检查 API 服务是否正常运行及路由是否正确配置
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://100wish.midikang.com';
const API_ENDPOINTS = [
  '/api/health',
  '/api/test',
  '/api/check-sync',
  '/api/wishes',
  '/api/wishes/sync'
];

// 允许自签名证书
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https://') ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = responseData ? JSON.parse(responseData) : {};
        } catch (e) {
          parsedData = { raw: responseData };
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function checkEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`\n检查端点: ${url}`);
  
  try {
    const response = await makeRequest(url);
    console.log(`状态码: ${response.statusCode}`);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('✅ 端点可访问');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ 端点访问失败');
      console.log('响应头:', response.headers);
      console.log('响应数据:', response.data);
    }
  } catch (error) {
    console.log('❌ 请求错误:', error.message);
  }
}

async function testSync() {
  const url = `${BASE_URL}/api/wishes/sync`;
  console.log(`\n测试同步端点: ${url}`);
  
  try {
    const testData = [{ id: 'test-id', title: '测试愿望', updatedAt: new Date().toISOString() }];
    const response = await makeRequest(url, 'POST', testData);
    
    console.log(`状态码: ${response.statusCode}`);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('✅ 同步端点可用');
      console.log('响应数据片段:', JSON.stringify(response.data).substring(0, 100) + '...');
    } else {
      console.log('❌ 同步端点异常');
      console.log('响应头:', response.headers);
      console.log('响应数据:', response.data);
    }
  } catch (error) {
    console.log('❌ 同步测试失败:', error.message);
  }
}

async function runDiagnostics() {
  console.log('===== API 诊断开始 =====');
  console.log(`基础 URL: ${BASE_URL}`);
  console.log('时间:', new Date().toISOString());
  
  // 检查所有端点
  for (const endpoint of API_ENDPOINTS) {
    await checkEndpoint(endpoint);
  }
  
  // 测试同步功能
  await testSync();
  
  console.log('\n===== API 诊断完成 =====');
}

runDiagnostics().catch(console.error);
