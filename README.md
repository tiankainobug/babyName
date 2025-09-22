# 宝宝起名系统

一个基于微信小程序的智能宝宝起名系统，包含前端小程序、Spring Boot后端服务和FastAPI起名服务三个独立模块。

## 项目架构

```
babyName/
├── frontend/           # 前端微信小程序 (uni-app + Vue3 + Pinia)
├── backend/           # 后端服务 (Spring Boot + JWT + MyBatis) 
├── fastapi-service/   # AI起名服务 (FastAPI + Python)
└── README.md         # 项目说明
```

## 功能特性

### 前端功能
- 用户登录/注册
- 宝宝信息填写（姓氏、性别、出生日期时间、偏好选项）
- 起名结果展示（名字 + 含义解析）
- 历史查询记录

### 后端功能
- 用户注册/登录/JWT鉴权
- 宝宝信息存储
- 历史记录管理
- API转发服务（调用FastAPI获取起名结果）

### AI起名服务
- 接收起名请求
- 基于用户输入生成Prompt
- 调用大模型API生成名字
- 返回候选名字和寓意解析

## 快速开始

### 1. 启动FastAPI服务

```bash
cd fastapi-service
pip install -r requirements.txt
python start.py
```

服务启动后访问: http://localhost:8000

### 2. 启动Spring Boot后端

```bash
cd backend

# 配置数据库
# 1. 创建MySQL数据库 baby_name
# 2. 修改 application.yml 中的数据库连接信息
# 3. 执行 schema.sql 创建表结构

# 启动服务
mvn spring-boot:run
```

服务启动后访问: http://localhost:8080

### 3. 启动前端小程序

```bash
cd frontend
npm install

# 开发微信小程序版本
npm run dev:mp-weixin
```

使用微信开发者工具导入 `frontend/dist/dev/mp-weixin` 目录

## 数据流通路

```
小程序前端 → Spring Boot API → FastAPI服务 → AI模型 → 返回结果
```

1. 用户在小程序填写宝宝信息
2. 前端调用Spring Boot API (`/api/names/generate`)
3. Spring Boot转发请求到FastAPI (`/generate-names`)
4. FastAPI调用AI模型或返回Mock数据
5. 结果逐级返回到前端展示

## API接口

### Spring Boot后端接口

- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/info` - 获取用户信息
- `POST /api/names/generate` - 生成名字
- `GET /api/names/history` - 获取历史记录
- `DELETE /api/names/history/{id}` - 删除历史记录

### FastAPI服务接口

- `POST /generate-names` - 生成宝宝名字
- `GET /health` - 健康检查

## 配置说明

### 数据库配置

修改 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/baby_name
    username: your_username
    password: your_password
```

### AI模型配置

修改 `fastapi-service/config.py`:

```python
ai_api_url = "你的AI API地址"
ai_api_key = "你的API密钥"
ai_model = "模型名称"
```

## 开发环境

- Node.js 16+
- Java 17+
- Python 3.8+
- MySQL 8.0+
- 微信开发者工具

## 技术栈

### 前端
- uni-app
- Vue 3
- Pinia (状态管理)
- 微信小程序

### 后端
- Spring Boot 3.2
- Spring Security + JWT
- MyBatis
- MySQL

### AI服务
- FastAPI
- Pydantic
- httpx
- uvicorn

## 注意事项

1. 首次运行需要创建数据库并执行SQL脚本
2. 修改各服务的配置文件中的连接信息
3. AI服务默认返回Mock数据，需要配置真实的AI API
4. 生产环境请修改CORS和安全配置

## 许可证

MIT License
