# 宝宝起名系统 - UniApp Vue3 版本

这是一个基于 UniApp 和 Vue3 开发的宝宝起名小程序，支持多端发布（微信小程序、H5、App等）。

## 技术栈

- **框架**: UniApp + Vue3
- **状态管理**: Pinia
- **构建工具**: Vite
- **开发语言**: JavaScript/TypeScript
- **UI组件**: 原生组件

## 项目结构

```
frontend/
├── api/                    # API接口
│   ├── request.js         # 请求封装
│   └── user.js           # 用户相关API
├── pages/                 # 页面
│   ├── login/            # 登录页面
│   ├── baby-info/        # 宝宝信息页面
│   ├── name-result/      # 起名结果页面
│   └── history/          # 历史记录页面
├── store/                 # 状态管理
│   └── user.js           # 用户状态
├── components/            # 公共组件
├── utils/                 # 工具函数
├── static/                # 静态资源
├── App.vue               # 应用入口
├── main.js               # 入口文件
├── pages.json            # 页面配置
├── manifest.json         # 应用配置
├── vite.config.js        # Vite配置
└── tsconfig.json         # TypeScript配置
```

## 开发环境

### 环境要求

- Node.js >= 16.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发命令

```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# App开发
npm run dev:app

# 其他平台
npm run dev:mp-alipay    # 支付宝小程序
npm run dev:mp-baidu     # 百度小程序
npm run dev:mp-toutiao   # 字节跳动小程序
```

### 构建命令

```bash
# H5构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# App构建
npm run build:app
```

## 功能特性

- ✅ 用户登录注册
- ✅ 宝宝信息录入
- ✅ 智能起名推荐
- ✅ 起名结果展示
- ✅ 历史记录管理
- ✅ 多端适配

## 页面说明

### 登录页面 (`pages/login/index.vue`)
- 用户登录/注册
- 表单验证
- 状态管理

### 宝宝信息页面 (`pages/baby-info/index.vue`)
- 姓氏输入
- 性别选择
- 出生日期时间选择
- 起名偏好设置

### 起名结果页面 (`pages/name-result/index.vue`)
- 显示推荐名字
- 名字详情（寓意、五行、笔画）
- 保存到历史记录

### 历史记录页面 (`pages/history/index.vue`)
- 查看历史起名记录
- 删除记录
- 重新查看结果

## 配置说明

### 页面配置 (`pages.json`)
- 页面路由配置
- 导航栏设置
- TabBar配置

### 应用配置 (`manifest.json`)
- 应用基本信息
- 各平台特定配置
- 权限设置

### API配置 (`api/request.js`)
- 请求拦截器
- 响应拦截器
- 错误处理
- Token管理

## 开发注意事项

1. **Vue3 Composition API**: 使用 `<script setup>` 语法
2. **UniApp API**: 使用 `uni.` 开头的API
3. **样式单位**: 使用 `rpx` 响应式单位
4. **生命周期**: 使用 UniApp 生命周期钩子
5. **路由跳转**: 使用 `uni.navigateTo`、`uni.switchTab` 等

## 部署说明

### 微信小程序
1. 在微信开发者工具中导入项目
2. 配置小程序AppID
3. 上传代码并提交审核

### H5
1. 运行 `npm run build:h5`
2. 将 `dist/build/h5` 目录部署到服务器

### App
1. 运行 `npm run build:app`
2. 使用HBuilderX打包为原生应用

## 常见问题

### 微信小程序编译失败

如果遇到以下错误：
- `文件查找失败：'@vue/devtools-api'`
- `文件查找失败：'vue-demi'`
- `Browserslist: caniuse-lite is outdated`

**解决步骤:**

1. 清理环境并重新安装：
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

2. 更新 browserslist：
```bash
npx update-browserslist-db@latest
```

3. 重新启动开发服务：
```bash
npm run dev:mp-weixin
```

详细排查指南请查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### 其他常见问题

1. **依赖安装失败**: 尝试清除缓存后重新安装
2. **编译错误**: 检查Node.js版本和依赖版本
3. **API请求失败**: 检查后端服务是否启动
4. **样式问题**: 确认使用rpx单位

## 更新日志

### v1.0.0
- 初始版本
- 基础功能实现
- 多端适配
