# 微信自动登录功能设置指南

## 功能概述

本次重构实现了微信自动登录功能，用户打开小程序后会自动进行微信登录，登录成功后直接跳转到起名页面，无需手动注册。

## 前端改动

### 1. 登录页面重构 (`frontend/pages/login/index.vue`)
- 移除了用户名密码输入框
- 实现了微信自动登录流程
- 添加了登录状态显示和错误处理
- 登录成功后自动跳转到起名页面

### 2. 用户状态管理更新 (`frontend/store/user.js`)
- 新增 `loginType` 状态，支持区分微信登录和普通登录
- 新增 `isWechatLogin` 计算属性
- 更新了状态初始化和清除逻辑

### 3. API接口扩展 (`frontend/api/user.js`)
- 新增 `wechatLogin` 接口，支持微信登录

## 后端改动

### 1. 用户控制器 (`backend/src/main/java/com/babyname/controller/UserController.java`)
- 实现了 `/api/user/wechat-login` 接口
- 支持微信授权码登录
- 保留了原有的登录和注册接口

### 2. 起名控制器 (`backend/src/main/java/com/babyname/controller/NameController.java`)
- 实现了起名生成、历史查看、删除历史等接口
- 提供了模拟数据用于演示

### 3. 项目配置
- 创建了 `pom.xml` 包含必要的Spring Boot依赖
- 创建了 `application.yml` 配置文件

## 配置步骤

### 1. 微信小程序配置

在 `frontend/manifest.json` 中设置你的微信小程序AppID：

```json
"mp-weixin": {
    "appid": "你的微信小程序AppID",
    // ... 其他配置
}
```

### 2. 后端配置

在 `backend/src/main/resources/application.yml` 中配置：

```yaml
wechat:
  mini-program:
    app-id: 你的微信小程序AppID
    app-secret: 你的微信小程序AppSecret

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/baby_name
    username: 你的数据库用户名
    password: 你的数据库密码
```

### 3. 数据库设置
- 创建名为 `baby_name` 的数据库
- 应用会自动创建所需的表结构

## 使用流程

1. **用户打开小程序**
   - 自动跳转到登录页面
   - 系统自动获取微信授权

2. **微信自动登录**
   - 获取微信授权码
   - 发送到后端进行登录验证
   - 后端返回JWT token和用户信息

3. **自动跳转**
   - 登录成功后自动跳转到起名页面
   - 用户可以直接开始起名

## 开发注意事项

### 前端
- 确保在微信小程序环境中测试
- 可以在微信开发者工具中调试
- 注意处理网络错误和授权失败的情况

### 后端
- 当前使用模拟数据，生产环境需要集成真实的微信API
- 需要实现真实的JWT token生成和验证
- 需要连接真实的数据库存储用户信息

### 生产环境集成
要在生产环境中使用，还需要：

1. **集成微信官方API**
   ```java
   // 使用code换取access_token
   String url = "https://api.weixin.qq.com/sns/jscode2session";
   // 实现真实的微信用户信息获取
   ```

2. **实现JWT认证**
   ```java
   // 生成真实的JWT token
   // 实现token验证中间件
   ```

3. **数据库实体设计**
   ```java
   @Entity
   public class User {
       private String openid;
       private String nickname;
       private String avatar;
       private String loginType;
       // ...
   }
   ```

## 测试

### 前端测试
- 在微信开发者工具中打开项目
- 测试自动登录流程
- 验证跳转到起名页面的逻辑

### 后端测试
```bash
# 启动后端服务
cd backend
mvn spring-boot:run

# 测试微信登录接口
curl -X POST http://localhost:8080/api/user/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code"}'
```

## 故障排除

1. **登录失败**
   - 检查微信小程序AppID配置
   - 确认后端服务正常运行
   - 查看控制台错误信息

2. **跳转失败**
   - 确认页面路由配置正确
   - 检查token是否正确保存

3. **网络错误**
   - 确认前后端通信正常
   - 检查跨域设置
