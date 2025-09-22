# 真实微信登录功能实现指南

## 概述

已将模拟的微信登录改为真实的微信API集成，包括：
- 真实的微信code换取session_key流程
- JWT token生成和验证
- 用户数据库存储
- 完整的用户管理功能

## 新增的核心组件

### 1. 数据库实体 (`User.java`)
- 用户信息存储
- 支持微信和普通登录类型
- 自动时间戳管理

### 2. 数据访问层 (`UserRepository.java`)
- 基于Spring Data JPA
- 支持按openid查询用户

### 3. JWT工具类 (`JwtUtil.java`)
- JWT token生成和验证
- 支持从token提取用户信息
- 可配置的密钥和过期时间

### 4. 微信服务 (`WechatService.java`)
- 调用微信官方API
- code换取session_key和openid
- 完整的错误处理

### 5. 用户服务 (`UserService.java`)
- 微信登录业务逻辑
- 用户创建和更新
- Token验证

## 配置步骤

### 1. 数据库设置

创建MySQL数据库：
```sql
CREATE DATABASE baby_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 微信小程序配置

在微信开发者平台获取：
- AppID
- AppSecret

### 3. 环境变量配置

#### 方式1: 环境变量 (推荐)
```bash
export WECHAT_APP_ID="your_real_wechat_app_id"
export WECHAT_APP_SECRET="your_real_wechat_app_secret"
export JWT_SECRET="your_very_long_jwt_secret_key"
export MYSQL_PASSWORD="your_mysql_password"
```

#### 方式2: 直接修改 application.yml
```yaml
wechat:
  mini-program:
    app-id: "wx1234567890abcdef"    # 替换为真实的AppID
    app-secret: "your_app_secret"   # 替换为真实的AppSecret

spring:
  datasource:
    password: your_mysql_password   # 替换为真实的MySQL密码
```

### 4. 启动应用

```bash
cd backend
mvn spring-boot:run
```

## API接口说明

### 微信登录接口

**POST** `/api/user/wechat-login`

请求体：
```json
{
  "code": "微信授权码"
}
```

响应（成功）：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "userInfo": {
      "openid": "oW_Tn5K...",
      "nickname": "微信用户",
      "avatar": "",
      "loginType": "wechat",
      "id": 1
    }
  }
}
```

响应（失败）：
```json
{
  "success": false,
  "message": "错误信息"
}
```

### 获取用户信息接口

**GET** `/api/user/info`

请求头：
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

### 更新用户信息接口

**POST** `/api/user/update-info`

请求头：
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

请求体：
```json
{
  "nickname": "新昵称",
  "avatar": "头像URL"
}
```

## 微信登录流程

### 1. 前端获取code
```javascript
uni.login({
    provider: 'weixin',
    success: (loginRes) => {
        // loginRes.code 就是授权码
        console.log('微信授权码:', loginRes.code)
    }
})
```

### 2. 后端处理流程

1. **接收code** - 前端传递的授权码
2. **调用微信API** - 使用code换取session_key和openid
3. **查找或创建用户** - 根据openid在数据库中查找或创建用户
4. **生成JWT token** - 为用户生成认证token
5. **返回结果** - 返回token和用户信息

### 3. 微信API调用

后端会调用微信官方接口：
```
GET https://api.weixin.qq.com/sns/jscode2session
?appid={AppID}
&secret={AppSecret}
&js_code={code}
&grant_type=authorization_code
```

## 数据库表结构

系统会自动创建 `users` 表：

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(255),
    avatar VARCHAR(255),
    login_type ENUM('WECHAT', 'NORMAL'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 安全性说明

### JWT Token
- 使用HS512算法签名
- 包含用户openid和nickname
- 默认7天过期时间
- 支持token验证和刷新

### 微信安全
- AppSecret严格保密，不暴露给前端
- 仅在服务器端调用微信API
- code一次性使用，防止重放攻击

## 错误处理

### 常见错误码

1. **40013** - invalid appid
   - 检查AppID配置是否正确

2. **40014** - invalid appsecret
   - 检查AppSecret配置是否正确

3. **40029** - code invalid
   - code已过期或已使用，需要重新获取

4. **45011** - API minute-quota reach limit
   - API调用频率超限，稍后重试

### 调试建议

1. **开启调试日志**
   ```yaml
   logging:
     level:
       com.babyname: DEBUG
   ```

2. **检查微信API响应**
   - 查看控制台日志中的微信API调用结果

3. **验证数据库连接**
   - 确保MySQL服务正常运行
   - 检查数据库连接配置

## 测试建议

### 1. 单元测试微信API
```bash
curl -X POST http://localhost:8080/api/user/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code_from_wechat"}'
```

### 2. 测试JWT token
```bash
# 使用返回的token测试用户信息接口
curl -X GET http://localhost:8080/api/user/info \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. 在微信开发者工具中测试
- 使用真实的微信小程序环境
- 测试完整的登录流程
- 验证token的持久化和验证

## 生产环境部署

### 1. 环境变量配置
```bash
# 生产环境配置
export SPRING_PROFILES_ACTIVE=prod
export WECHAT_APP_ID="生产环境的AppID"
export WECHAT_APP_SECRET="生产环境的AppSecret"
export JWT_SECRET="生产环境的强密码"
export MYSQL_HOST="生产数据库地址"
export MYSQL_PASSWORD="生产数据库密码"
```

### 2. 安全加固
- 使用HTTPS
- 配置CORS策略
- 实施API限流
- 添加监控和日志

### 3. 性能优化
- 配置数据库连接池
- 启用Redis缓存
- 优化JWT过期策略

现在你的微信登录已经是真实的实现了！🎉
