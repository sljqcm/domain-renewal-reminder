# Git 集成自动部署指南

本指南将帮助你设置 Cloudflare Pages 的 Git 集成，实现代码推送后自动构建和部署。

---

## 📋 前提条件

- ✅ 代码已推送到 GitHub 仓库
- ✅ 拥有 Cloudflare 账号
- ✅ 后端已部署到 Cloudflare Workers

---

## 🚀 设置步骤

### 步骤 1: 登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 使用你的账号登录

### 步骤 2: 创建 Pages 项目

1. 在左侧菜单中，点击 **Workers & Pages**
2. 点击 **Create application** 按钮
3. 选择 **Pages** 标签
4. 点击 **Connect to Git** 按钮

### 步骤 3: 连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 如果是第一次使用，需要授权 Cloudflare 访问你的 GitHub：
   - 点击 **Connect GitHub**
   - 在弹出窗口中登录 GitHub
   - 选择授权范围（建议选择 "Only select repositories"）
   - 选择 `domain-renewal-reminder` 仓库
   - 点击 **Install & Authorize**
3. 返回 Cloudflare，选择 `zhikanyeye/domain-renewal-reminder` 仓库
4. 点击 **Begin setup**

### 步骤 4: 配置构建设置

在构建配置页面，填写以下信息：

**基本设置：**
```
Project name: domain-renewal-reminder
Production branch: main
```

**构建设置：**
```
Framework preset: None (或 Vite)
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: / (留空或填 /)
```

**重要说明：**
- `Build command` 会先进入 frontend 目录，安装依赖，然后构建
- `Build output directory` 指向构建后的静态文件目录
- `Root directory` 保持为根目录

### 步骤 5: 配置环境变量（关键步骤）

在同一页面向下滚动，找到 **Environment variables** 部分：

1. 点击 **Add variable** 按钮
2. 填写环境变量：
   - **Variable name**: `VITE_API_URL`
   - **Value**: `https://your-worker-url.workers.dev/api`（替换为你的实际 Worker URL）
   - **Environment**: 选择 **Production**
3. 点击 **Add** 确认

**为什么需要这个环境变量？**
- Vite 在构建时会将 `import.meta.env.VITE_API_URL` 替换为实际的 API URL
- 这样前端就能正确连接到后端 API

### 步骤 6: 开始部署

1. 检查所有配置是否正确
2. 点击 **Save and Deploy** 按钮
3. Cloudflare Pages 会开始构建和部署

### 步骤 7: 查看构建进度

1. 你会被重定向到部署页面
2. 可以实时查看构建日志：
   - 克隆仓库
   - 安装依赖
   - 运行构建命令
   - 部署到 CDN
3. 构建通常需要 2-5 分钟

### 步骤 8: 获取部署 URL

构建成功后，你会看到：
```
✅ Deployment successful!
Your site is live at: https://domain-renewal-reminder.pages.dev
```

记录这个 URL，这是你的生产环境地址。

---

## 🔄 日常使用流程

设置完成后，每次更新代码只需：

```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "更新说明"

# 3. 推送到 GitHub
git push

# 4. Cloudflare Pages 会自动：
#    - 检测到代码变更
#    - 触发新的构建
#    - 自动部署到生产环境
```

**无需手动构建和部署！**

---

## 📊 管理部署

### 查看部署历史

1. 在 Cloudflare Dashboard 中，进入你的 Pages 项目
2. 点击 **Deployments** 标签
3. 可以看到所有部署记录：
   - 部署时间
   - Git commit 信息
   - 构建状态
   - 部署 URL

### 回滚到之前的版本

1. 在 **Deployments** 列表中找到要回滚的版本
2. 点击该部署右侧的 **...** 菜单
3. 选择 **Rollback to this deployment**
4. 确认回滚

### 查看构建日志

1. 点击任意部署记录
2. 点击 **View build log**
3. 可以查看详细的构建过程和错误信息

---

## 🌿 分支部署（预览环境）

Cloudflare Pages 支持为每个分支创建预览部署：

### 创建预览分支

```bash
# 创建新分支
git checkout -b feature/new-feature

# 修改代码并提交
git add .
git commit -m "添加新功能"

# 推送分支
git push origin feature/new-feature
```

### 查看预览部署

1. 推送后，Cloudflare Pages 会自动为该分支创建预览部署
2. 在 **Deployments** 中可以看到预览 URL：
   ```
   https://feature-new-feature.domain-renewal-reminder.pages.dev
   ```
3. 可以在预览环境中测试新功能
4. 确认无误后，合并到 main 分支

---

## 🔧 修改配置

### 修改环境变量

1. 进入 Pages 项目
2. 点击 **Settings** 标签
3. 点击 **Environment variables**
4. 可以添加、修改或删除环境变量
5. 修改后需要触发重新部署（推送新代码或手动重新部署）

### 修改构建设置

1. 进入 Pages 项目
2. 点击 **Settings** 标签
3. 点击 **Builds & deployments**
4. 可以修改：
   - 构建命令
   - 输出目录
   - 环境变量
   - Node.js 版本

### 手动触发重新部署

如果只修改了环境变量，需要手动触发重新部署：

1. 进入 **Deployments** 标签
2. 点击 **Create deployment** 按钮
3. 选择要部署的分支
4. 点击 **Save and Deploy**

---

## 🌐 配置自定义域名

### 添加自定义域名

1. 进入 Pages 项目
2. 点击 **Custom domains** 标签
3. 点击 **Set up a custom domain**
4. 输入你的域名（例如：`app.yourdomain.com`）
5. 点击 **Continue**

### DNS 配置

Cloudflare 会自动配置 DNS：
- 如果域名在 Cloudflare 管理，会自动添加 CNAME 记录
- 如果域名在其他服务商，需要手动添加 CNAME 记录：
  ```
  CNAME app domain-renewal-reminder.pages.dev
  ```

### SSL 证书

Cloudflare 会自动为自定义域名配置 SSL 证书，通常在几分钟内生效。

---

## 🔍 故障排查

### 构建失败

**查看构建日志：**
1. 进入失败的部署
2. 点击 **View build log**
3. 查找错误信息

**常见问题：**

1. **依赖安装失败**
   ```
   Error: Cannot find module 'xxx'
   ```
   解决：检查 `package.json` 中的依赖是否正确

2. **构建命令错误**
   ```
   Error: Command failed: cd frontend && npm run build
   ```
   解决：检查构建命令是否正确，路径是否存在

3. **环境变量未设置**
   ```
   Error: VITE_API_URL is not defined
   ```
   解决：在 Pages 设置中添加环境变量

### 部署成功但页面无法访问后端

**检查环境变量：**
1. 确认 `VITE_API_URL` 已正确设置
2. 确认 Worker URL 正确
3. 触发重新部署

**检查 CORS：**
确保后端启用了 CORS，允许前端域名访问。

### 推送代码后没有触发部署

**检查 GitHub 集成：**
1. 进入 Pages 项目 **Settings** > **Builds & deployments**
2. 检查 **Build configuration** 是否启用
3. 检查 **Production branch** 是否正确

**检查 GitHub Webhooks：**
1. 进入 GitHub 仓库 **Settings** > **Webhooks**
2. 找到 Cloudflare Pages 的 webhook
3. 检查最近的 deliveries 是否成功

---

## 📈 性能优化

### 启用缓存

Cloudflare Pages 自动为静态资源启用 CDN 缓存，无需额外配置。

### 配置 Headers

创建 `frontend/public/_headers` 文件：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 配置 Redirects

创建 `frontend/public/_redirects` 文件：

```
# SPA 路由支持
/*    /index.html   200

# 重定向示例
/old-path  /new-path  301
```

---

## 🔐 安全建议

1. **保护环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用 Cloudflare Pages 环境变量管理

2. **限制 GitHub 访问**
   - 只授权必要的仓库
   - 定期检查授权状态

3. **启用分支保护**
   - 在 GitHub 中为 main 分支启用保护
   - 要求 Pull Request 审核

4. **监控部署**
   - 定期检查部署日志
   - 设置告警通知

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 查看构建日志中的错误信息
3. 检查 GitHub Actions 状态
4. 联系 Cloudflare 支持

---

## ✅ 完成检查清单

- [ ] GitHub 仓库已创建并推送代码
- [ ] Cloudflare Pages 项目已创建
- [ ] Git 集成已配置
- [ ] 构建设置已正确配置
- [ ] 环境变量 `VITE_API_URL` 已设置
- [ ] 首次部署成功
- [ ] 前端可以正常访问
- [ ] 前端可以连接到后端 API
- [ ] 管理员登录功能正常
- [ ] 推送代码可以触发自动部署
- [ ] 自定义域名已配置（可选）

---

恭喜！你已经成功设置了 Git 集成自动部署。现在每次推送代码都会自动构建和部署到生产环境。🎉
