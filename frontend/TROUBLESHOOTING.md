# 问题排查指南

## 微信小程序启动报错解决方案

### 问题1: pinia 依赖找不到 '@vue/devtools-api' 和 'vue-demi'

**错误信息:**
```
文件查找失败：'@vue/devtools-api' at node_modules/.pnpm/pinia@2.3.1_@vue+composition-api@1.7.2_typescript@5.9.2_vue@3.5.21/node_modules/pinia/dist/pinia.mjs:27
文件查找失败：'vue-demi' at node_modules/.pnpm/pinia@2.3.1_@vue+composition-api@1.7.2_typescript@5.9.2_vue@3.5.21/node_modules/pinia/dist/pinia.mjs:26
```

**解决方案:**
1. 已在 `package.json` 中添加了缺失的依赖
2. 已在 `vite.config.js` 中添加了 `optimizeDeps` 配置
3. 已更新到兼容的版本

### 问题2: browserslist 数据过期

**错误信息:**
```
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
```

**解决方案:**
```bash
cd frontend
npx update-browserslist-db@latest
```

### 问题3: 依赖版本兼容性问题

**问题描述:** UniApp 各个包的版本不一致导致编译失败

**解决方案:** 已将所有 `@dcloudio/*` 包更新到同一版本：`3.0.0-alpha-4080120250919001`

## 完整修复步骤

### 1. 清理环境
```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
```

### 2. 重新安装依赖
```bash
pnpm install
```

### 3. 更新 browserslist
```bash
npx update-browserslist-db@latest
```

### 4. 启动微信小程序开发
```bash
npm run dev:mp-weixin
```

## 验证步骤

1. **检查依赖安装**
   ```bash
   ls node_modules/@dcloudio/
   ```
   应该看到所有 uni-app 相关包

2. **检查 pnpm 锁定文件**
   ```bash
   cat pnpm-lock.yaml | grep "@dcloudio/uni-app"
   ```
   确认版本一致

3. **测试编译**
   ```bash
   npm run dev:mp-weixin
   ```
   应该能正常启动编译

## 常见问题

### Q1: 编译时提示 "vue 版本不匹配"
**A:** 确保 Vue 版本与 UniApp 版本兼容，当前使用 Vue 3.4.21

### Q2: TypeScript 类型错误
**A:** 检查 `tsconfig.json` 配置，确保包含了正确的类型定义

### Q3: Vite 构建失败
**A:** 检查 `vite.config.js` 中的插件配置

## 版本信息

当前项目使用的关键依赖版本：

- **Vue:** 3.4.21
- **UniApp:** 3.0.0-alpha-4080120250919001
- **Pinia:** 2.1.7
- **Vite:** 5.2.8
- **TypeScript:** 5.4.5

## 开发环境要求

- **Node.js:** >= 16.0.0
- **pnpm:** 最新版本（推荐）
- **HBuilderX:** 3.8+ （可选）

## 额外说明

1. **Alpha 版本说明:** 由于使用了 UniApp 3.0 的 alpha 版本，可能存在一些不稳定的问题，建议在生产环境使用稳定版本。

2. **多端兼容性:** 当前配置主要针对微信小程序优化，其他平台可能需要额外配置。

3. **热更新:** 在开发过程中，如果遇到热更新问题，可以重启开发服务器。
