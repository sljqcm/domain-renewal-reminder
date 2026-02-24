# 邮件服务配置指南

本指南帮助你为域名续期提醒系统配置邮件发送功能。系统已内置两种邮件发送方式，你只需在管理员面板中选择和配置即可。

## 📋 目录

- [概述](#概述)
- [方案对比](#方案对比)
- [方式一：HTTP API（推荐）](#方式一http-api推荐)
- [方式二：SMTP（高级）](#方式二smtp高级)
- [管理员面板配置](#管理员面板配置)
- [测试邮件发送](#测试邮件发送)
- [常见问题](#常见问题)
- [快速开始](#快速开始)

## 概述

系统已经内置了完整的邮件发送功能，支持两种方式：

1. **HTTP API 方式**（推荐）- 使用第三方邮件服务的 HTTP API
2. **SMTP 方式**（高级）- 使用 TCP Socket 实现 SMTP 协议

**重要提示**：代码已经实现好了，你只需要在管理员面板中选择方式并填写配置信息即可，无需修改代码！

## 方案对比

| 方案 | 难度 | 可靠性 | 免费额度 | 配置时间 | 推荐度 |
|------|------|--------|----------|----------|--------|
| HTTP API（Resend） | ⭐ 简单 | ⭐⭐⭐⭐⭐ 高 | 100封/天 | 5分钟 | ✅ 强烈推荐 |
| HTTP API（SendGrid） | ⭐ 简单 | ⭐⭐⭐⭐⭐ 高 | 100封/天 | 5分钟 | ✅ 推荐 |
| HTTP API（Mailgun） | ⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 高 | 5000封/月 | 10分钟 | ✅ 推荐 |
| SMTP（企业邮箱） | ⭐⭐⭐⭐ 复杂 | ⭐⭐⭐ 中 | 取决于服务商 | 15分钟 | ⚠️ 仅限高级用户 |

### 为什么推荐 HTTP API？

- ✅ **配置简单**：只需要 API Key，5 分钟搞定
- ✅ **可靠性高**：专业团队维护，99.9% 可用性
- ✅ **免费额度**：足够个人和小型应用使用
- ✅ **无需改代码**：系统已内置，只需配置
- ✅ **自动重试**：发送失败自动重试
- ✅ **详细日志**：完整的发送日志和统计

### SMTP 方式的限制

- ❌ **端口 25 被禁止**：Cloudflare Workers 不支持
- ⚠️ **配置复杂**：需要填写多个参数
- ⚠️ **调试困难**：网络协议级别的调试
- ⚠️ **仅支持 465/587**：SSL 和 TLS 端口

### 选择建议

| 使用场景 | 推荐方案 |
|---------|---------|
| 个人用户 | Resend（最简单） |
| 小型团队 | SendGrid 或 Mailgun |
| 发送量大 | Mailgun（5000封/月） |
| 必须用企业邮箱 | SMTP 方式 |
| 自建邮件服务器 | SMTP 方式 |

---

## 方式一：HTTP API（推荐）

系统已内置三个主流邮件服务的支持，你只需要注册账号、获取 API Key，然后在管理员面板配置即可。

### 1. Resend（最推荐，最简单）

**为什么选择 Resend？**
- ✅ 配置最简单，5 分钟搞定
- ✅ 免费额度：100 封/天（3000 封/月）
- ✅ 界面友好，文档清晰
- ✅ 专为开发者设计

**配置步骤：**

1. **注册账号**
   - 访问 https://resend.com
   - 使用 GitHub 或邮箱注册

2. **获取 API Key**
   - 登录后进入 Dashboard
   - 点击 "API Keys" > "Create API Key"
   - 复制 API Key（以 `re_` 开头）

3. **在管理员面板配置**
   - 访问 `https://你的域名/admin`
   - 进入"SMTP 配置"标签
   - 选择"HTTP API（推荐）"
   - API 服务商选择"Resend"
   - 粘贴 API Key
   - 发件人邮箱：`onboarding@resend.dev`（测试用）或你的域名邮箱
   - 发件人名称：`爱自由域名管理`
   - 点击"保存配置"

4. **测试**
   - 注册一个新账号
   - 检查邮箱是否收到验证邮件

**注意事项：**
- 测试时可以使用 `onboarding@resend.dev`（Resend 提供的测试地址）
- 生产环境建议验证自己的域名，然后使用 `noreply@yourdomain.com`
- 验证域名需要添加 DNS 记录，通常 5-10 分钟生效

---

### 2. SendGrid

**为什么选择 SendGrid？**
- ✅ 功能强大，企业级可靠性
- ✅ 免费额度：100 封/天（3000 封/月）
- ✅ 详细的发送统计和分析
- ✅ 支持高级功能（模板、A/B 测试等）

**配置步骤：**

1. **注册账号**
   - 访问 https://sendgrid.com
   - 注册并完成邮箱验证

2. **获取 API Key**
   - 登录后进入 Settings > API Keys
   - 点击 "Create API Key"
   - 选择 "Full Access" 或 "Restricted Access"（选择 Mail Send 权限）
   - 复制 API Key（以 `SG.` 开头）

3. **验证发件人**
   - 进入 Settings > Sender Authentication
   - 验证单个邮箱或整个域名
   - 按照提示完成验证

4. **在管理员面板配置**
   - 访问管理员面板
   - 选择"HTTP API" > "SendGrid"
   - 粘贴 API Key
   - 填写已验证的发件人邮箱
   - 保存配置

---

### 3. Mailgun

**为什么选择 Mailgun？**
- ✅ 免费额度最高：5000 封/月（前 3 个月）
- ✅ 适合发送量大的应用
- ✅ 强大的 API 和 Webhook 支持
- ✅ 详细的日志和分析

**配置步骤：**

1. **注册账号**
   - 访问 https://www.mailgun.com
   - 注册并验证邮箱

2. **获取 API Key 和域名**
   - 登录后进入 Sending > Domain settings
   - 复制 API Key
   - 复制 Domain name（如 `mg.yourdomain.com` 或使用 Mailgun 提供的沙盒域名）

3. **在管理员面板配置**
   - 访问管理员面板
   - 选择"HTTP API" > "Mailgun"
   - 粘贴 API Key
   - 填写 Mailgun 域名
   - 填写发件人邮箱（必须是该域名下的邮箱）
   - 保存配置

**注意事项：**
- 沙盒域名只能发送给授权的邮箱地址
- 生产环境需要验证自己的域名
- 验证域名需要添加多个 DNS 记录

---

### 4. 自定义 API

如果你使用其他邮件服务或自建 API，可以选择"自定义 API"选项。

**要求：**
- API 端点支持 HTTPS
- 接受 JSON 格式的请求
- 返回标准的 HTTP 状态码

**配置步骤：**
1. 在管理员面板选择"自定义 API"
2. 填写 API 服务器地址
3. 填写 API Key 或认证信息
4. 保存配置

**注意**：自定义 API 需要你的 API 端点符合系统的请求格式，可能需要修改 `src/services/email.ts` 中的 `sendViaCustomApi` 方法。

---

## 方式二：SMTP（高级用户）

如果你需要使用企业邮箱或自建邮件服务器，可以选择 SMTP 方式。系统已经实现了完整的 SMTP 协议，你只需要在管理员面板填写配置信息即可。

### 前置要求

1. **确认 SMTP 服务支持端口 465 或 587**
   - ❌ 端口 25 被 Cloudflare Workers 禁止
   - ✅ 端口 465：SMTPS（SSL 加密）
   - ✅ 端口 587：SMTP with STARTTLS（TLS 加密）

2. **准备 SMTP 认证信息**
   - SMTP 服务器地址（如 `smtp.gmail.com`）
   - 端口号（465 或 587）
   - 用户名（通常是邮箱地址）
   - 密码（可能是应用专用密码）
   - 发件人邮箱地址

### 常见 SMTP 服务配置

#### Gmail

**配置信息：**
- 服务器：`smtp.gmail.com`
- 端口：`587`（TLS）或 `465`（SSL）
- 用户名：你的 Gmail 地址
- 密码：应用专用密码（不是账号密码！）

**获取应用专用密码：**
1. 启用 Gmail 两步验证
2. 访问 https://myaccount.google.com/apppasswords
3. 选择"邮件"和"其他设备"
4. 生成密码并复制

#### Outlook/Hotmail

**配置信息：**
- 服务器：`smtp-mail.outlook.com`
- 端口：`587`（TLS）
- 用户名：你的 Outlook 邮箱
- 密码：账号密码或应用密码

#### QQ 邮箱

**配置信息：**
- 服务器：`smtp.qq.com`
- 端口：`465`（SSL）或 `587`（TLS）
- 用户名：你的 QQ 邮箱
- 密码：授权码（不是 QQ 密码！）

**获取授权码：**
1. 登录 QQ 邮箱网页版
2. 设置 > 账户 > POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
3. 开启 SMTP 服务
4. 生成授权码

#### 163 邮箱

**配置信息：**
- 服务器：`smtp.163.com`
- 端口：`465`（SSL）或 `587`（TLS）
- 用户名：你的 163 邮箱
- 密码：授权码

#### 企业邮箱

**配置信息：**
- 服务器：由邮箱服务商提供
- 端口：通常是 `587` 或 `465`
- 用户名：企业邮箱地址
- 密码：邮箱密码

**注意**：联系你的 IT 管理员获取准确的 SMTP 配置信息。

### 配置步骤

1. **访问管理员面板**
   - 打开 `https://你的域名/admin`
   - 输入管理员密码登录

2. **进入 SMTP 配置**
   - 点击"SMTP 配置"标签
   - 选择"SMTP（高级）"

3. **填写配置信息**
   - **SMTP 服务器**：如 `smtp.gmail.com`
   - **端口**：选择 `465` 或 `587`
   - **用户名**：你的邮箱地址（某些服务不需要）
   - **密码**：应用专用密码或授权码
   - **发件人邮箱**：发件地址（通常与用户名相同）
   - **发件人名称**：`爱自由域名管理`

4. **保存配置**
   - 点击"保存配置"按钮
   - 等待提示"SMTP 配置已保存"

5. **测试邮件发送**
   - 注册一个新账号
   - 检查是否收到验证邮件

### 常见问题

#### 问题：SMTP 连接失败

**可能原因：**
- 端口被阻止
- 服务器地址错误
- 防火墙限制

**解决方法：**
1. 确认使用端口 465 或 587（不要使用 25）
2. 检查 SMTP 服务器地址是否正确
3. 确认 SMTP 服务支持 SSL/TLS

#### 问题：认证失败

**可能原因：**
- 用户名或密码错误
- 使用了账号密码而不是应用专用密码
- SMTP 服务未开启

**解决方法：**
1. Gmail：使用应用专用密码，不是账号密码
2. QQ/163：使用授权码，不是邮箱密码
3. 确认 SMTP 服务已开启

#### 问题：邮件发送超时

**可能原因：**
- 网络问题
- SMTP 服务器响应慢
- Cloudflare Workers 超时

**解决方法：**
1. 检查 Cloudflare Workers 日志：`wrangler tail`
2. 尝试使用不同的 SMTP 服务器
3. 考虑切换到 HTTP API 方式

### 技术细节

系统已经实现了完整的 SMTP 协议，包括：

- ✅ EHLO 握手
- ✅ AUTH LOGIN 认证
- ✅ STARTTLS 升级（端口 587）
- ✅ SSL 连接（端口 465）
- ✅ MAIL FROM、RCPT TO、DATA 命令
- ✅ 错误处理和重试
- ✅ 日志记录

你无需了解这些技术细节，只需要在管理员面板填写配置信息即可。

---

## 管理员面板配置

系统提供了统一的配置界面，所有邮件配置都在一个页面完成。

### 访问管理员面板

1. 打开浏览器访问：`https://你的域名/admin`
2. 输入管理员密码（在 Cloudflare Workers 环境变量 `ADMIN_PASSWORD` 中设置）
3. 点击"SMTP 配置"标签

### 配置界面说明

#### 1. 选择邮件发送方式

界面顶部有两个大按钮：

**HTTP API（推荐）**
- 绿色标签：✓ 简单易用 ✓ 高可靠性 ✓ 免费额度
- 适合：个人用户、小型团队
- 配置时间：5 分钟

**SMTP（高级）**
- 橙色标签：⚠️ 仅支持端口 465/587 ⚠️ 配置复杂
- 适合：企业邮箱、自建服务器
- 配置时间：15 分钟

点击任一按钮选择发送方式，界面会自动显示对应的配置项。

#### 2. HTTP API 配置项

选择 HTTP API 后，会显示：

**API 服务商**（下拉选择）
- Resend（推荐，100封/天）
- SendGrid（100封/天）
- Mailgun（5000封/月）
- 自定义 API

**根据服务商显示不同配置：**

- **Resend/SendGrid**：
  - API Key 输入框
  - 提示：在服务商控制面板获取

- **Mailgun**：
  - API Key 输入框
  - Mailgun 域名输入框
  - 提示：在 Mailgun 控制面板找到域名

- **自定义 API**：
  - API 服务器地址输入框
  - API Key 输入框

#### 3. SMTP 配置项

选择 SMTP 后，会显示：

**警告提示框**（橙色）
- 端口 25 被禁止
- 仅支持端口 465/587
- 需要 STARTTLS 或 SSL 支持
- 配置错误可能导致发送失败

**配置输入框：**
- SMTP 服务器（如 `smtp.gmail.com`）
- 端口（下拉选择：465 或 587）
- 用户名（可选）
- 密码

#### 4. 通用配置

无论选择哪种方式，都需要填写：

**发件人信息**
- 发件人邮箱：如 `noreply@yourdomain.com`
- 发件人名称：如 `爱自由域名管理`

**提示信息：**
- HTTP API：需要在服务商控制面板验证此邮箱或域名
- SMTP：必须是 SMTP 服务器允许的发件地址

#### 5. 操作按钮

**保存配置**（紫色渐变按钮）
- 点击保存配置
- 显示加载动画
- 成功后显示绿色提示

**查看配置指南**（灰色边框按钮）
- 链接到本文档
- 在新标签页打开

### 配置示例

#### 示例 1：使用 Resend（最简单）

1. 选择"HTTP API（推荐）"
2. API 服务商选择"Resend"
3. 填写：
   - API Key: `re_xxxxxxxxxxxxx`
   - 发件人邮箱: `onboarding@resend.dev`
   - 发件人名称: `爱自由域名管理`
4. 点击"保存配置"

#### 示例 2：使用 Gmail SMTP

1. 选择"SMTP（高级）"
2. 填写：
   - SMTP 服务器: `smtp.gmail.com`
   - 端口: `587`
   - 用户名: `your-email@gmail.com`
   - 密码: `应用专用密码`
   - 发件人邮箱: `your-email@gmail.com`
   - 发件人名称: `爱自由域名管理`
3. 点击"保存配置"

#### 示例 3：使用 Mailgun

1. 选择"HTTP API（推荐）"
2. API 服务商选择"Mailgun"
3. 填写：
   - API Key: `key-xxxxxxxxxxxxx`
   - Mailgun 域名: `mg.yourdomain.com`
   - 发件人邮箱: `noreply@mg.yourdomain.com`
   - 发件人名称: `爱自由域名管理`
4. 点击"保存配置"

### 配置切换

你可以随时在 HTTP API 和 SMTP 之间切换：

1. 访问管理员面板
2. 选择新的发送方式
3. 填写新的配置信息
4. 保存配置

系统会自动使用新的配置发送邮件。

---

## 测试邮件发送

### 方法 1: 通过注册测试

1. 访问前端注册页面
2. 使用你的邮箱注册
3. 检查邮箱是否收到验证邮件
4. 检查垃圾邮件文件夹

### 方法 2: 通过 API 测试

```bash
curl -X POST "https://你的worker地址.workers.dev/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### 方法 3: 查看日志

使用 Wrangler 查看实时日志：

```bash
wrangler tail
```

查看邮件发送的日志输出，包括成功或失败信息。

---

## 常见问题

### 关于 HTTP API

#### Q: 为什么推荐 HTTP API 而不是 SMTP？

A: HTTP API 有以下优势：
- ✅ 配置简单，只需要 API Key
- ✅ 可靠性高，99.9% 可用性
- ✅ 自动重试，发送失败会自动重试
- ✅ 详细日志，可以追踪每封邮件
- ✅ 无需改代码，系统已内置

SMTP 需要实现复杂的网络协议，调试困难，不推荐新手使用。

#### Q: 免费额度够用吗？

A: 对于个人使用或小型应用，完全够用：
- Resend: 100 封/天 = 3,000 封/月
- SendGrid: 100 封/天 = 3,000 封/月
- Mailgun: 5,000 封/月（前 3 个月）

假设每天有 10 个新用户注册，每个用户有 3 个域名，每个域名发送 2 次提醒：
- 每天邮件量：10（注册）+ 10×3×2（提醒）= 70 封
- 完全在免费额度内

#### Q: 如何验证发件人域名？

A: 在邮件服务提供商的控制面板中：

**Resend：**
1. Dashboard > Domains > Add Domain
2. 输入你的域名
3. 添加 DNS 记录（SPF、DKIM）
4. 等待验证（5-10 分钟）

**SendGrid：**
1. Settings > Sender Authentication > Authenticate Your Domain
2. 选择 DNS 提供商
3. 添加 DNS 记录
4. 等待验证

**Mailgun：**
1. Sending > Domains > Add New Domain
2. 输入域名
3. 添加 DNS 记录（SPF、DKIM、CNAME）
4. 等待验证

验证域名后可以使用自定义域名发送邮件（如 `noreply@yourdomain.com`），提高送达率。

#### Q: 邮件进入垃圾箱怎么办？

A: 提高邮件送达率的方法：

1. **验证发件人域名**（最重要）
   - 添加 SPF、DKIM、DMARC 记录
   - 使用已验证的域名发送

2. **优化邮件内容**
   - 避免使用垃圾邮件常用词汇（如"免费"、"中奖"）
   - 提供退订链接
   - 使用清晰的发件人名称

3. **保持良好的发送记录**
   - 不要短时间内发送大量邮件
   - 及时处理退信
   - 定期清理无效邮箱

4. **使用专业邮件服务**
   - Resend/SendGrid/Mailgun 都有良好的 IP 信誉
   - 比自建 SMTP 服务器送达率更高

#### Q: 如何切换邮件服务？

A: 非常简单：

1. 访问管理员面板
2. 选择新的 API 服务商
3. 填写新的 API Key
4. 保存配置

系统会立即使用新的服务发送邮件，无需重启或重新部署。

### 关于 SMTP

#### Q: Cloudflare Workers 支持 SMTP 吗？

A: 支持，但有限制：
- ✅ 可以通过 TCP Socket API 实现 SMTP 客户端
- ❌ 端口 25 被禁止（SMTP 默认端口）
- ✅ 端口 465（SSL）和 587（TLS）可用
- ⚠️ 系统已实现完整的 SMTP 协议，你只需配置即可

#### Q: 为什么 SMTP 认证失败？

A: 常见原因：

**Gmail：**
- ❌ 使用了账号密码
- ✅ 应该使用应用专用密码
- 获取方法：https://myaccount.google.com/apppasswords

**QQ/163 邮箱：**
- ❌ 使用了邮箱密码
- ✅ 应该使用授权码
- 获取方法：邮箱设置 > 账户 > SMTP 服务 > 生成授权码

**企业邮箱：**
- 联系 IT 管理员确认 SMTP 配置
- 确认 SMTP 服务已开启
- 确认用户名和密码正确

#### Q: SMTP 连接超时怎么办？

A: 可能的原因和解决方法：

1. **端口被阻止**
   - 确认使用端口 465 或 587
   - 不要使用端口 25

2. **服务器地址错误**
   - 检查 SMTP 服务器地址
   - 确认没有多余的空格

3. **网络问题**
   - 查看 Cloudflare Workers 日志：`wrangler tail`
   - 尝试使用不同的 SMTP 服务器

4. **建议**
   - 如果 SMTP 持续失败，建议切换到 HTTP API 方式
   - HTTP API 更稳定，配置更简单

#### Q: 可以使用企业邮箱吗？

A: 可以，使用 SMTP 方式：

1. 联系 IT 管理员获取 SMTP 配置：
   - SMTP 服务器地址
   - 端口（465 或 587）
   - 认证方式
   - 用户名和密码

2. 在管理员面板配置：
   - 选择"SMTP（高级）"
   - 填写企业邮箱 SMTP 信息
   - 保存配置

3. 测试邮件发送

**注意**：企业邮箱可能有发送限制，请咨询 IT 管理员。

### 关于测试和调试

#### Q: 如何测试邮件发送？

A: 三种测试方法：

**方法 1：通过注册测试**
1. 访问注册页面
2. 使用你的真实邮箱注册
3. 检查是否收到验证邮件
4. 检查垃圾邮件文件夹

**方法 2：通过 API 测试**
```bash
curl -X POST "https://你的域名/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

**方法 3：查看日志**
```bash
wrangler tail
```
实时查看邮件发送日志，包括成功或失败信息。

#### Q: 如何查看邮件发送日志？

A: 使用 Wrangler CLI：

```bash
# 实时查看日志
wrangler tail

# 查看最近的日志
wrangler tail --format pretty

# 过滤邮件相关日志
wrangler tail | grep "email"
```

日志会显示：
- 邮件发送方式（HTTP API 或 SMTP）
- 收件人地址
- 发送结果（成功或失败）
- 错误信息（如果失败）

#### Q: 邮件发送失败怎么办？

A: 排查步骤：

1. **查看日志**
   ```bash
   wrangler tail
   ```
   查看具体的错误信息

2. **检查配置**
   - API Key 是否正确
   - 发件人邮箱是否已验证
   - SMTP 用户名密码是否正确

3. **测试 API Key**
   - 在服务商控制面板测试 API Key 是否有效
   - 检查 API Key 权限

4. **切换服务**
   - 如果一个服务不行，尝试另一个
   - Resend 最简单，推荐优先尝试

5. **寻求帮助**
   - 查看服务商文档
   - 提交 GitHub Issue
   - 联系服务商支持

### 关于安全和隐私

#### Q: API Key 安全吗？

A: 系统采用了多重安全措施：

1. **加密存储**
   - API Key 使用 AES-256-GCM 加密
   - 存储在 Cloudflare KV 中
   - 只有管理员可以访问

2. **传输安全**
   - 所有通信使用 HTTPS
   - API Key 不会出现在日志中
   - 不会发送到前端

3. **访问控制**
   - 只有管理员可以配置
   - 需要管理员密码认证
   - 操作记录在审计日志中

4. **建议**
   - 定期更换 API Key
   - 使用强管理员密码
   - 不要在公开场合分享配置

#### Q: 邮件内容会被记录吗？

A: 系统的日志策略：

- ✅ 记录：收件人地址、发送时间、发送结果
- ❌ 不记录：邮件主题、邮件内容、API Key
- ✅ 加密：敏感配置信息加密存储
- ✅ 审计：管理员操作记录在审计日志

邮件内容只在发送时临时存在于内存中，不会持久化存储。

---

## 快速开始

如果你想快速开始，推荐使用 Resend，5 分钟搞定！

### 步骤 1：注册 Resend

1. 访问 https://resend.com
2. 点击"Sign Up"
3. 使用 GitHub 或邮箱注册

### 步骤 2：获取 API Key

1. 登录后自动进入 Dashboard
2. 点击左侧菜单"API Keys"
3. 点击"Create API Key"
4. 输入名称（如 `domain-reminder`）
5. 点击"Add"
6. 复制 API Key（以 `re_` 开头）

### 步骤 3：配置管理员面板

1. 访问 `https://你的域名/admin`
2. 输入管理员密码登录
3. 点击"SMTP 配置"标签
4. 选择"HTTP API（推荐）"
5. API 服务商选择"Resend（推荐，100封/天）"
6. 粘贴 API Key
7. 发件人邮箱填写：`onboarding@resend.dev`（测试用）
8. 发件人名称填写：`爱自由域名管理`
9. 点击"保存配置"

### 步骤 4：测试

1. 退出管理员面板
2. 访问注册页面：`https://你的域名/register`
3. 使用你的真实邮箱注册
4. 检查邮箱是否收到验证邮件
5. 如果没收到，检查垃圾邮件文件夹

### 步骤 5：验证域名（可选，生产环境推荐）

如果你想使用自己的域名发送邮件（如 `noreply@yourdomain.com`）：

1. 在 Resend Dashboard 点击"Domains"
2. 点击"Add Domain"
3. 输入你的域名（如 `yourdomain.com`）
4. 按照提示添加 DNS 记录：
   - SPF 记录（TXT）
   - DKIM 记录（TXT）
   - DMARC 记录（TXT，可选）
5. 等待验证（通常 5-10 分钟）
6. 验证成功后，在管理员面板更新发件人邮箱为 `noreply@yourdomain.com`

完成！你的邮件服务已经配置好了。

---

## 技术参考

### 系统架构

```
用户注册/域名提醒
    ↓
EmailService (src/services/email.ts)
    ↓
根据 provider 选择发送方式
    ↓
┌─────────────────┬─────────────────┐
│   HTTP API      │      SMTP       │
├─────────────────┼─────────────────┤
│ sendViaResend   │  sendViaSmtp    │
│ sendViaSendGrid │  (TCP Socket)   │
│ sendViaMailgun  │                 │
│ sendViaCustom   │                 │
└─────────────────┴─────────────────┘
    ↓                    ↓
邮件服务商 API      SMTP 服务器
```

### 已实现的功能

系统已经完整实现了以下功能，你无需修改代码：

**HTTP API 支持：**
- ✅ Resend API 集成
- ✅ SendGrid API 集成
- ✅ Mailgun API 集成
- ✅ 自定义 API 支持
- ✅ 自动重试机制
- ✅ 错误处理和日志

**SMTP 支持：**
- ✅ TCP Socket 连接
- ✅ EHLO 握手
- ✅ AUTH LOGIN 认证
- ✅ STARTTLS 升级（端口 587）
- ✅ SSL 连接（端口 465）
- ✅ MAIL FROM、RCPT TO、DATA 命令
- ✅ Base64 编码
- ✅ 错误处理和日志

**配置管理：**
- ✅ 统一的管理员面板
- ✅ 动态配置切换
- ✅ 配置加密存储
- ✅ 配置验证

**邮件模板：**
- ✅ 注册验证邮件
- ✅ 域名续期提醒邮件
- ✅ HTML 格式
- ✅ 响应式设计

### 相关文档

**Cloudflare Workers：**
- TCP Sockets API: https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/
- KV Storage: https://developers.cloudflare.com/kv/
- Environment Variables: https://developers.cloudflare.com/workers/configuration/environment-variables/

**SMTP 协议：**
- RFC 5321: Simple Mail Transfer Protocol
- RFC 3207: SMTP Service Extension for Secure SMTP over TLS
- RFC 4954: SMTP Service Extension for Authentication

**邮件服务文档：**
- Resend: https://resend.com/docs
- SendGrid: https://docs.sendgrid.com
- Mailgun: https://documentation.mailgun.com

### 代码位置

如果你需要了解实现细节或进行自定义：

- **邮件服务**：`src/services/email.ts`
- **类型定义**：`src/types/index.ts`
- **配置验证**：`src/utils/validation.ts`
- **管理员面板**：`frontend/src/pages/Admin.tsx`
- **API 客户端**：`frontend/src/api/client.ts`

### 环境变量

系统使用以下环境变量（在 Cloudflare Workers 中配置）：

- `ADMIN_PASSWORD`：管理员密码
- `ENCRYPTION_KEY`：数据加密密钥
- `D1_DATABASE`：D1 数据库绑定
- `KV`：KV 命名空间绑定

SMTP 配置存储在 KV 中，使用 `ENCRYPTION_KEY` 加密。

---

## 总结

本系统提供了灵活、强大的邮件配置功能：

**推荐方案（5 分钟搞定）：**
1. 注册 Resend 账号
2. 获取 API Key
3. 在管理员面板配置
4. 测试邮件发送

**高级方案（企业邮箱）：**
1. 获取 SMTP 配置信息
2. 在管理员面板配置
3. 测试邮件发送

**核心优势：**
- ✅ 无需修改代码
- ✅ 统一配置界面
- ✅ 灵活切换方式
- ✅ 详细的文档和示例
- ✅ 完整的错误处理

如果遇到问题，请查看[常见问题](#常见问题)或提交 GitHub Issue。

祝你使用愉快！🎉
