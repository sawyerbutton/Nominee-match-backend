# Nominee Match API设计文档

## 1. API概述

### 1.1 基础信息
- 基础URL: `https://api.nominee-match.com/v1`
- 认证方式: Bearer Token
- 响应格式: JSON
- 字符编码: UTF-8

### 1.2 通用响应格式
```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "Success"
}
```

### 1.3 错误响应格式
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  },
  "message": "Error occurred"
}
```

## 2. 认证API

### 2.1 用户注册
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "role": "developer"
}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "developer"
  },
  "error": null,
  "message": "Registration successful"
}
```

### 2.2 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

响应:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "developer"
    }
  },
  "error": null,
  "message": "Login successful"
}
```

## 3. 开发者API

### 3.1 获取开发者列表
```http
GET /developers
Authorization: Bearer {token}
Query Parameters:
  - page: 页码
  - limit: 每页数量
  - skills: 技能标签
  - minRate: 最低时薪
  - maxRate: 最高时薪
```

响应:
```json
{
  "success": true,
  "data": {
    "developers": [
      {
        "id": "uuid",
        "name": "John Doe",
        "title": "Senior Developer",
        "skills": ["JavaScript", "TypeScript", "Node.js"],
        "hourlyRate": 50,
        "rating": 4.8
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  },
  "error": null,
  "message": "Success"
}
```

### 3.2 获取开发者详情
```http
GET /developers/{id}
Authorization: Bearer {token}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "title": "Senior Developer",
    "bio": "Experienced full-stack developer...",
    "skills": ["JavaScript", "TypeScript", "Node.js"],
    "experience": [
      {
        "company": "Tech Corp",
        "position": "Senior Developer",
        "duration": "2020-2023",
        "description": "Led development team..."
      }
    ],
    "hourlyRate": 50,
    "rating": 4.8,
    "availability": "Full-time",
    "preferences": {
      "workType": ["Remote", "On-site"],
      "projectSize": ["Small", "Medium"],
      "technologies": ["JavaScript", "TypeScript"]
    }
  },
  "error": null,
  "message": "Success"
}
```

## 4. 匹配API

### 4.1 创建匹配请求
```http
POST /matches
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": "uuid",
  "developerId": "uuid",
  "requirements": {
    "skills": ["JavaScript", "TypeScript"],
    "experience": "3+ years",
    "availability": "Full-time"
  }
}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "developerId": "uuid",
    "matchScore": 85.5,
    "status": "pending",
    "createdAt": "2024-03-30T10:00:00Z"
  },
  "error": null,
  "message": "Match request created successfully"
}
```

### 4.2 获取匹配结果
```http
GET /matches/{id}
Authorization: Bearer {token}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "developerId": "uuid",
    "matchScore": 85.5,
    "status": "accepted",
    "details": {
      "skillMatch": 90,
      "experienceMatch": 85,
      "availabilityMatch": 80,
      "preferenceMatch": 85
    },
    "createdAt": "2024-03-30T10:00:00Z",
    "updatedAt": "2024-03-30T10:30:00Z"
  },
  "error": null,
  "message": "Success"
}
```

## 5. 支付API

### 5.1 创建支付订单
```http
POST /payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "matchId": "uuid",
  "amount": 1000,
  "currency": "USD",
  "paymentMethod": "credit_card"
}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "matchId": "uuid",
    "amount": 1000,
    "currency": "USD",
    "status": "pending",
    "paymentUrl": "https://payment-gateway.com/checkout/xxx",
    "createdAt": "2024-03-30T10:00:00Z"
  },
  "error": null,
  "message": "Payment order created successfully"
}
```

### 5.2 获取支付状态
```http
GET /payments/{id}
Authorization: Bearer {token}
```

响应:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "matchId": "uuid",
    "amount": 1000,
    "currency": "USD",
    "status": "completed",
    "transactionId": "txn_xxx",
    "createdAt": "2024-03-30T10:00:00Z",
    "completedAt": "2024-03-30T10:05:00Z"
  },
  "error": null,
  "message": "Success"
}
```

## 6. 错误码说明

### 6.1 通用错误码
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 429: 请求过于频繁
- 500: 服务器内部错误

### 6.2 业务错误码
- AUTH_001: 邮箱已注册
- AUTH_002: 密码错误
- AUTH_003: Token过期
- DEV_001: 开发者不存在
- MATCH_001: 匹配请求已存在
- PAY_001: 支付金额错误
- PAY_002: 支付失败

## 7. 速率限制

### 7.1 API限制
- 认证API: 5次/分钟
- 开发者API: 60次/分钟
- 匹配API: 30次/分钟
- 支付API: 10次/分钟

### 7.2 超出限制响应
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 60,
      "remaining": 0,
      "reset": "2024-03-30T11:00:00Z"
    }
  },
  "message": "Rate limit exceeded"
}
``` 