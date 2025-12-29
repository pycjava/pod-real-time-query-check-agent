# 容器连接跟踪事件实时查询系统

一个用于统一查询多个 Agent 的连接跟踪信息、定位源 Pod 的完整 Web 应用程序，包含前端界面和 Flask 后端 API 服务。（个人练习版本）

## 📑 目录导航

- [项目结构](#-项目结构)
- [功能特性](#-功能特性)
- [技术栈](#️-技术栈)
- [快速开始](#-快速开始)
  - [前端 Web 应用](#-前端-web-应用real-time-js)
  - [Flask 后端 API](#-flask-后端-api-服务)
- [前后端对接](#-前后端对接)
- [API 接口文档](#api-接口文档)
- [使用说明](#-前端使用说明)
- [部署指南](#部署)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)

---

## 📂 项目结构

```
pod-real-time-query-check-agent/
├── real-time-js/          # 前端 Web 应用
│   ├── index.html         # 主页面
│   ├── style.css          # 样式文件
│   └── script.js          # JavaScript 逻辑
├── real-time-py/          # Flask 后端 API
│   ├── app/              # 应用代码
│   ├── config.py         # 配置文件
│   ├── main.py           # 入口文件
│   └── requirements.txt  # 依赖包
└── README.md             # 项目文档（本文件）
```

## 🎯 功能特性

### 前端功能
- 🔍 **实时查询**: 查询容器连接跟踪事件状态
- 🌐 **多协议支持**: 支持 TCP、UDP、ICMP 协议
- 📊 **详细信息**: 显示连接状态、源 Pod IP 和完整的 Pod 信息
- ✨ **现代UI**: 美观的渐变设计和流畅的交互动画
- 📱 **响应式设计**: 完美支持桌面和移动设备
- ✅ **表单验证**: 实时验证 IP 地址和端口号格式
- 🔗 **URL 参数支持**: 支持从 URL 参数自动填充表单并查询
- 📋 **链接分享**: 一键复制查询链接，方便分享查询结果
- 📑 **多 Pod 标签页**: 支持多个 Pod 信息的标签页切换显示

### 后端功能
- ✅ **RESTful API**: 标准的 HTTP 接口
- ✅ **连接状态查询**: TCP/UDP/ICMP 协议支持
- ✅ **Pod 信息查询**: 获取详细的 Pod 信息
- ✅ **参数验证**: IP 地址、端口号、协议类型验证
- ✅ **CORS 跨域支持**: 支持前后端分离部署
- ✅ **错误处理**: 完整的错误处理和日志记录
- ✅ **K8s 集成**: 支持集成 Kubernetes API（可选）

## 页面预览

### 主要功能模块

1. **查询参数表单**
   - 协议选择（TCP/UDP/ICMP）
   - 源 IP 和源端口
   - 目标 IP 和目标端口
   - 实时表单验证

2. **查询结果展示**
   - 连接状态标识（ESTABLISHED、TIME_WAIT 等）
   - 源 Pod IP 地址（支持单个/多个 IP 标签显示）
   - Pod 详细信息标签页（支持多 Pod 切换）
     - Pod IP
     - Pod Name
     - Namespace
     - Node
     - Status
   - 操作按钮
     - 分享按钮（复制查询链接）
     - 查询咨询按钮（查看信息摘要）

## 🛠️ 技术栈

### 前端技术栈
- **HTML5**: 语义化标记
- **CSS3**: 现代样式、渐变、动画
- **JavaScript (ES6+)**: 原生 JavaScript，无框架依赖

### 后端技术栈
- **Flask 3.0**: 轻量级 Web 框架
- **Flask-CORS**: 跨域资源共享
- **Python 3.8+**: 编程语言
- **Gunicorn**: WSGI HTTP 服务器
- **Kubernetes Client**: K8s API 客户端（可选）

## 🚀 快速开始

本项目分为前端和后端两部分，可以独立运行或组合使用。

### 方式一：仅运行前端（使用模拟数据）

前端可以独立运行，使用内置的模拟数据进行演示。

### 方式二：前后端联调（推荐）

先启动后端 API 服务，再运行前端，实现完整的数据查询功能。

---

## 📱 前端 Web 应用（real-time-js）

### 特点

- 纯静态 Web 应用，无需任何依赖
- 可独立运行（使用模拟数据）
- 也可对接后端 API（实时数据）

### 快速运行前端

#### 1. 使用本地服务器（推荐）

```bash
cd real-time-js

# 使用 Python 3
python -m http.server 8000

# 使用 Python 2
python -m SimpleHTTPServer 8000

# 使用 Node.js (需要先安装 http-server)
npx http-server -p 8000
```

#### 2. 直接打开

双击 `real-time-js/index.html` 文件在浏览器中打开。

#### 3. 访问应用

打开浏览器访问 `http://localhost:8000`

### 前端技术实现

## 📖 前端使用说明

### 基础查询

1. 选择协议类型（默认为 TCP）
2. 输入源 IP 地址（例如：192.168.1.226）
3. 输入源端口（例如：5672）
4. 输入目标 IP 地址（例如：172.16.11.105）
5. 输入目标端口（例如：56606）
6. 点击"查询连接状态"按钮
7. 查看查询结果

### 输入验证

- **IP 地址**: 必须是有效的 IPv4 地址格式（0-255.0-255.0-255.0-255）
- **端口号**: 必须是 1-65535 之间的数字

### 查询结果

查询成功后，系统将显示：

- **连接状态**: 当前连接的状态（如 ESTABLISHED）
- **源 Pod IP**: 实际发起连接的 Pod 的 IP 地址
- **Pod 信息**: 包含 Pod IP、Pod Name、Namespace、Node 和 Status
- **操作按钮**:
  - 🔗 **分享按钮**: 一键复制查询链接到剪贴板，显示成功提示
  - ✅ **查询咨询按钮**: 查看详细的查询信息摘要

## 分享功能详解

### 功能概览

系统提供了独立的**分享按钮**，方便用户快速复制和分享查询链接。

### 界面布局

查询结果页面右上角有两个按钮：

```
┌─────────────────────────────────────────────────┐
│  ORIGIN SOURCE IP (源 POD IP)                   │
│  [IP 1] 172.17.0.3  [IP 2] 172.17.0.4          │
│                                                  │
│                    [🔗 分享] [✓ 查询咨询]       │
└─────────────────────────────────────────────────┘
```

### 分享按钮功能（蓝色）

**功能**：一键复制查询链接到剪贴板

**操作流程**：
1. 完成一次查询
2. 点击"分享"按钮
3. 看到底部弹出"✨ 分享链接已复制到剪贴板"提示
4. 链接已自动复制，可以直接粘贴分享

**生成的链接示例**：
```
http://localhost:8000/index.html?protocol=TCP&sourceIp=192.168.1.226&sourcePort=5672&targetIp=172.16.11.105&targetPort=56606
```

**使用场景**：
- 📨 通过邮件分享查询结果
- 💬 在即时通讯工具中发送链接
- 📝 在文档中嵌入查询链接
- 🔖 保存为浏览器书签

### 查询咨询按钮（绿色）

**功能**：查看详细的查询信息摘要

**操作流程**：
1. 完成查询后点击
2. 弹窗显示完整的查询信息：
   - 连接状态
   - 所有源 Pod IP
   - 所有 Pod 的详细信息

**显示内容示例**：
```
查询信息已准备好！

状态: ESTABLISHED

源 Pod IP:
  IP 1: 172.17.0.3
  IP 2: 172.17.0.4
  IP 3: 172.17.0.5

Pod 1:
  Pod IP: 172.17.0.3
  Pod Name: alertcenter-765f4d54dc-vlswp
  Namespace: test-devops
  Node: node-1
  Status: Running

Pod 2:
  ...
```

### Toast 提示

**样式特点**：
- ✨ 从底部优雅弹出
- 🎨 绿色渐变背景
- ✔️ 带有勾选动画图标
- ⏱️ 3秒后自动消失

**显示位置**：固定在页面底部中央，不影响页面内容查看。

### 交互动画

**分享按钮动画**：
1. 按钮本身有轻微缩放效果（0.5秒）
2. 底部 Toast 从下方滑入
3. Toast 中的勾选图标有旋转缩放动画

**响应式设计**：
- **桌面端**: 两个按钮横向排列，与 IP 显示区域底部对齐
- **移动端**: 按钮纵向堆叠，自动拉伸至全宽，Toast 提示依然居中显示

## URL 参数功能详解

### 功能说明

系统支持通过 URL 参数直接填充表单并自动查询，方便分享查询结果或创建快捷链接。

### URL 参数格式

```
index.html?protocol=TCP&sourceIp=192.168.1.226&sourcePort=5672&targetIp=172.16.11.105&targetPort=56606
```

### 参数说明

| 参数名 | 说明 | 示例值 | 是否必需 |
|--------|------|--------|----------|
| `protocol` | 协议类型 | TCP, UDP, ICMP | 可选 |
| `sourceIp` | 源 IP 地址 | 192.168.1.226 | 可选 |
| `sourcePort` | 源端口 | 5672 | 可选 |
| `targetIp` | 目标 IP 地址 | 172.16.11.105 | 可选 |
| `targetPort` | 目标端口 | 56606 | 可选 |

### 使用示例

#### 示例 1：完整参数查询

```
index.html?protocol=TCP&sourceIp=192.168.1.226&sourcePort=5672&targetIp=172.16.11.105&targetPort=56606
```

页面会自动：
1. ✅ 填充协议为 TCP
2. ✅ 填充源 IP 为 192.168.1.226
3. ✅ 填充源端口为 5672
4. ✅ 填充目标 IP 为 172.16.11.105
5. ✅ 填充目标端口为 56606
6. ✅ 自动执行查询
7. ✅ 自动滚动到查询结果

#### 示例 2：部分参数预填充

```
index.html?protocol=UDP&sourceIp=172.18.0.5
```

页面会：
1. ✅ 填充协议为 UDP
2. ✅ 填充源 IP 为 172.18.0.5
3. ⏸️ 其他字段留空，等待用户手动输入

#### 示例 3：ICMP 协议查询

```
index.html?protocol=ICMP&sourceIp=172.19.0.8&sourcePort=0&targetIp=172.19.0.1&targetPort=0
```

### 自动查询功能

**自动查询条件**：

只要 URL 中包含任何查询参数，系统就会：
- 📝 自动填充对应的表单字段
- 🔍 自动触发查询（延迟 300ms 等待页面加载）
- 📜 自动滚动到结果区域（延迟 1200ms 等待查询完成）

**查询链接分享**：

点击 "分享" 按钮时：
- 📋 自动生成带当前参数的 URL
- 📎 复制到剪贴板
- 🔗 可以分享给其他人，一键重现查询结果

### 实际应用场景

#### 场景 1：快速查询链接

在文档或工单中添加快捷链接：

```markdown
检查 RabbitMQ 连接：
[点击查询](index.html?protocol=TCP&sourceIp=192.168.1.226&sourcePort=5672&targetIp=172.16.11.105&targetPort=56606)
```

#### 场景 2：监控告警集成

监控系统告警中包含查询链接：

```
告警: Pod 连接异常
详情: http://conntrack.example.com/index.html?protocol=TCP&sourceIp=172.17.0.3&sourcePort=3306&targetIp=10.0.1.5&targetPort=45678
```

#### 场景 3：书签/收藏夹

创建常用查询的浏览器书签：

```
生产环境-MySQL-主库: 
?protocol=TCP&sourceIp=192.168.10.100&sourcePort=3306&targetIp=10.0.2.50&targetPort=38920

测试环境-Redis-缓存:
?protocol=TCP&sourceIp=192.168.20.200&sourcePort=6379&targetIp=10.0.3.80&targetPort=52341
```

#### 场景 4：API 文档

提供给运维团队的查询示例：

```bash
# 查询数据库连接
http://conntrack.example.com/?protocol=TCP&sourceIp=DB_IP&sourcePort=3306&targetIp=POD_IP&targetPort=EPHEMERAL_PORT

# 查询消息队列连接
http://conntrack.example.com/?protocol=TCP&sourceIp=MQ_IP&sourcePort=5672&targetIp=POD_IP&targetPort=EPHEMERAL_PORT
```

### 最佳实践

#### 1. 团队协作

建立查询链接库：

```markdown
## 常用查询链接

### 生产环境
- [RabbitMQ主库](http://...)
- [MySQL从库](http://...)

### 测试环境
- [Redis缓存](http://...)
```

#### 2. 监控集成

在监控告警中包含查询链接：

```
告警: Pod 连接异常
详情: 点击查看 [查询结果](分享链接)
```

#### 3. 文档嵌入

在技术文档中嵌入可执行的查询链接：

```markdown
检查步骤：
1. 查看日志
2. [查询连接状态](分享链接)
3. 检查资源使用情况
```

## 📁 详细项目结构

### 前端项目结构（real-time-js）

```
real-time-js/
│
├── index.html          # 主 HTML 文件
├── style.css           # 样式文件
├── script.js           # JavaScript 逻辑
└── test-links.html     # 测试链接页面
```

**文件说明**:

- **index.html**: 包含完整的页面结构（表单、结果展示区域）
- **style.css**: 全局样式、组件样式、响应式设计、动画效果
- **script.js**: 表单验证、API 调用、结果展示、URL 参数处理

### 后端项目结构（real-time-py）

```
real-time-py/
├── app/
│   ├── __init__.py      # Flask 应用初始化
│   ├── routes.py        # API 路由定义
│   ├── models.py        # 数据模型
│   ├── validators.py    # 参数验证
│   └── services.py      # 业务逻辑服务
├── config.py            # 配置管理
├── main.py              # 应用入口
├── requirements.txt     # Python 依赖
├── env.sample           # 环境变量示例
├── Dockerfile           # Docker 镜像构建
└── README.md            # 后端详细文档
```

**核心模块**:

- **app/__init__.py**: Flask 应用工厂，注册蓝图和扩展
- **app/routes.py**: API 路由（查询接口、状态接口）
- **app/models.py**: 数据模型（PodInfo、ConnectionStatus）
- **app/validators.py**: 参数验证（IP、端口、协议）
- **app/services.py**: 业务逻辑（K8s 查询、连接跟踪）
- **config.py**: 多环境配置（开发/生产）
- **main.py**: 应用启动入口

## 技术实现细节

### HTML 结构

```html
<div class="action-buttons">
    <button class="btn-share" id="shareBtn">
        🔗 分享
    </button>
    <button class="btn-success" id="queryConsultBtn">
        ✓ 查询咨询
    </button>
</div>

<div id="toast" class="toast"></div>
```

### JavaScript API

#### 显示 Toast

```javascript
showToast('✨ 分享链接已复制到剪贴板', 3000);
```

参数：
- `message`: 要显示的消息文本
- `duration`: 显示持续时间（毫秒，默认3000）

#### 生成分享链接

```javascript
const shareUrl = generateQueryUrl(
    protocol,   // 协议类型
    sourceIp,   // 源 IP
    sourcePort, // 源端口
    targetIp,   // 目标 IP
    targetPort  // 目标端口
);
```

#### 手动触发填充和查询

```javascript
// 如果需要在页面加载后手动触发
await fillFormFromUrlAndQuery();
```

#### 获取当前 URL 参数

```javascript
// 获取当前 URL 的所有参数
const params = getUrlParams();
console.log(params);
// 输出: { protocol: 'TCP', sourceIp: '192.168.1.226', ... }
```

### CSS 样式类

```css
.btn-share        /* 分享按钮样式 */
.btn-success      /* 查询咨询按钮样式 */
.action-buttons   /* 按钮组容器 */
.toast           /* Toast 提示容器 */
.toast.show      /* Toast 显示状态 */
.share-success   /* 分享成功动画 */
```

## 🔗 前后端对接

### 前端对接后端 API

前端默认使用模拟数据。要对接后端 Flask API，需要修改 `real-time-js/script.js` 中的 `queryConnectionStatus` 函数：

**修改前（使用模拟数据）**:
```javascript
async function queryConnectionStatus(params) {
    // 返回模拟数据
    return mockData[params.protocol] || mockData['TCP'];
}
```

**修改后（调用后端 API）**:
```javascript
async function queryConnectionStatus(params) {
    try {
        // 调用 Flask 后端 API
        const response = await fetch('http://localhost:5000/api/conntrack/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.data;  // 返回实际数据
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('API 调用失败:', error);
        // 降级到模拟数据
        return mockData[params.protocol] || mockData['TCP'];
    }
}
```

### API 数据格式

**前端发送的请求**:
```json
{
  "protocol": "TCP",
  "sourceIp": "192.168.1.226",
  "sourcePort": "5672",
  "targetIp": "172.16.11.105",
  "targetPort": "56606"
}
```

**后端返回的响应**:
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "status": "ESTABLISHED",
    "originSourceIp": ["172.17.0.3", "172.17.0.4"],
    "podInfoList": [
      {
        "podIp": "172.17.0.3",
        "podName": "alertcenter-765f4d54dc-vlswp",
        "namespace": "test-devops",
        "node": "node-1",
        "status": "Running"
      }
    ]
  }
}
```

### 对接步骤

1. **启动后端服务**
   ```bash
   cd real-time-py
   python main.py
   ```

2. **修改前端代码**
   - 编辑 `real-time-js/script.js`
   - 找到 `queryConnectionStatus` 函数
   - 替换为上面的"修改后"代码

3. **启动前端服务**
   ```bash
   cd real-time-js
   python -m http.server 8000
   ```

4. **测试集成**
   - 访问 `http://localhost:8000`
   - 填写查询参数
   - 点击查询按钮
   - 查看从后端返回的数据

## 浏览器兼容性

- ✅ Chrome/Edge 63+ (最新版本)
- ✅ Firefox 53+ (最新版本)
- ✅ Safari 13.1+ (最新版本)
- ✅ Opera 50+ (最新版本)

使用了以下现代 API：
- `URLSearchParams`：解析 URL 参数
- `navigator.clipboard`：复制到剪贴板
- `scrollIntoView`：平滑滚动

### 降级处理

如果浏览器不支持剪贴板 API，会弹出 alert 显示链接，用户可手动复制。

## 注意事项

1. **URL 编码**：特殊字符会自动进行 URL 编码
2. **参数验证**：即使从 URL 加载，仍会进行 IP 和端口格式验证
3. **无参数模式**：如果 URL 中没有任何参数，页面正常显示空表单
4. **延迟执行**：自动查询有 300ms 延迟，确保页面完全加载
5. **安全性**：不要在 URL 中包含敏感信息（系统仅用于查询参数）

## 自定义配置

### 修改默认端口

在 `index.html` 底部的页脚中，可以修改 Agent Port 显示：

```html
<footer class="footer">
    <p>Conntrack Server · Agent Port: 9358</p>
</footer>
```

### 添加更多协议

在 `index.html` 的协议选择下拉框中添加选项：

```html
<select id="protocol" name="protocol" class="form-control">
    <option value="TCP">TCP</option>
    <option value="UDP">UDP</option>
    <option value="ICMP">ICMP</option>
    <!-- 添加更多协议 -->
</select>
```

### 自定义主题颜色

在 `style.css` 中修改 CSS 变量或直接修改颜色值：

```css
/* 主色调 */
.btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

/* 成功色 */
.btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

### 自定义 Toast 样式

修改 `style.css` 中的 `.toast` 类：

```css
.toast {
    background: /* 你的颜色 */;
    border-radius: /* 你的圆角 */;
    /* 其他样式... */
}
```

## 开发建议

### 本地开发

1. 使用 VS Code 或其他代码编辑器
2. 安装 Live Server 扩展（VS Code）实现热重载
3. 使用浏览器开发者工具进行调试

### 代码规范

- HTML: 使用语义化标签
- CSS: 使用 BEM 命名规范（可选）
- JavaScript: 使用 ES6+ 语法

## 部署

### 静态托管服务

可以部署到以下平台：

- **Vercel**: 拖拽文件夹即可部署
- **Netlify**: 支持拖拽或 Git 集成
- **GitHub Pages**: 免费的静态网站托管
- **Nginx/Apache**: 传统 Web 服务器

### 部署步骤（以 Nginx 为例）

1. 将所有文件复制到 Web 服务器目录
```bash
cp -r * /var/www/html/conntrack/
```

2. 配置 Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/conntrack;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. 重启 Nginx
```bash
sudo systemctl restart nginx
```

💡 **提示**：在生产环境部署时，建议配置 Web 服务器支持 URL 重写，隐藏 `.html` 扩展名。

## ❓ 常见问题

### 前后端对接相关

### Q: 为什么查询后没有显示真实数据？
**A**: 
- 如果只运行了前端，默认使用模拟数据
- 要获取真实数据，需要：
  1. 启动后端 Flask 服务（`cd real-time-py && python main.py`）
  2. 修改前端 `script.js` 中的 `queryConnectionStatus` 函数
  3. 确保后端服务正常运行（访问 `http://localhost:5000/health`）

### Q: 出现 CORS 跨域错误怎么办？
**A**: 
- 检查后端 Flask 服务是否正常运行
- 确认后端 `config.py` 中 CORS 配置正确：`CORS_ORIGINS = '*'`（开发环境）
- 生产环境应设置具体的前端域名

### Q: 前端请求后端一直转圈不显示？
**A**: 
- 打开浏览器开发者工具（F12）查看 Console 错误信息
- 检查 Network 标签，查看 API 请求状态
- 确认后端服务是否正常运行
- 检查前端代码中的变量作用域是否正确

### Q: 后端返回 200 但前端不显示数据？
**A**: 
- 检查后端返回的数据格式是否正确
- 确认前端代码中 `result.data` 的处理逻辑
- 查看浏览器 Console 是否有 JavaScript 错误

### 前端功能相关

### Q: 可以修改 UI 样式吗？
**A**: 当然可以！所有样式都在 `style.css` 中，可以自由修改。

### Q: 支持 IPv6 吗？
**A**: 当前版本仅支持 IPv4。如需 IPv6 支持，需要修改 `script.js` 中的 `validateIP` 函数。

### Q: 如何添加更多字段？
**A**: 在 HTML 中添加表单字段，在 CSS 中添加样式，在 JavaScript 中处理新字段的逻辑。

### Q: 点击分享按钮没有反应？
**A**: 可能的原因：
1. 浏览器不支持剪贴板 API（尝试使用现代浏览器）
2. 网站未使用 HTTPS（本地测试除外）
3. 浏览器禁用了剪贴板权限

**解决方法**：
- 使用支持的浏览器
- 在浏览器设置中允许剪贴板访问
- 如果弹出 alert，手动复制链接

### Q: Toast 提示显示不完整？
**A**: 在小屏幕设备上，Toast 会自动调整宽度。如果仍有问题，可以：
- 旋转设备为横屏
- 缩小浏览器字体
- 使用更大的设备查看

### Q: 分享链接太长怎么办？
**A**: 可以考虑：
1. 使用短链接服务（如 bit.ly）
2. 部署后端服务存储查询参数
3. 使用二维码分享

## 快捷键支持（未来）

计划支持的快捷键：
- `Ctrl/Cmd + K`: 快速复制分享链接
- `Ctrl/Cmd + I`: 打开查询咨询弹窗

## 更新日志

### v1.1.0 (当前版本)
- ✨ 新增独立的分享按钮
- 🎉 添加 Toast 提示功能
- 🎨 优化按钮布局和动画
- 📱 改进移动端响应式设计
- 🔄 将分享功能从查询咨询按钮中分离
- ✅ URL 参数自动填充和查询
- 🔗 链接分享功能完善

### v1.0.0 (2025-12-29)
- ✨ 初始版本发布
- ✅ 实现基本查询功能
- ✅ 添加表单验证
- ✅ 实现响应式设计
- ✅ 添加加载动画和过渡效果

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: support@example.com
- 项目地址: https://github.com/your-repo/conntrack-query

---

---

## 🔧 Flask 后端 API 服务

### 简介

`real-time-py` 目录包含一个完整的 Flask 后端 API 服务，用于查询 Kubernetes 服务器连接状态。

### 核心功能

- ✅ 连接状态查询（TCP/UDP/ICMP 协议）
- ✅ Pod 信息查询（IP、Name、Namespace、Node、Status）
- ✅ 参数验证（IP 地址、端口号、协议类型）
- ✅ RESTful API 接口
- ✅ CORS 跨域支持
- ✅ 错误处理和日志记录

### 快速启动后端

#### 1. 安装依赖

```bash
cd real-time-py

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

#### 2. 配置环境变量（可选）

```bash
# 复制环境变量示例文件
cp env.sample .env

# 编辑 .env 文件
# FLASK_PORT=5000
# FLASK_DEBUG=True
# CORS_ORIGINS=*
```

#### 3. 运行服务

```bash
python main.py
```

服务将在 `http://localhost:5000` 启动。

#### 4. 验证服务

```bash
# 健康检查
curl http://localhost:5000/health

# 测试查询接口
curl -X POST http://localhost:5000/api/conntrack/query \
  -H "Content-Type: application/json" \
  -d '{
    "protocol": "TCP",
    "sourceIp": "192.168.1.226",
    "sourcePort": "5672",
    "targetIp": "172.16.11.105",
    "targetPort": "56606"
  }'
```

### API 接口文档

#### 1. 查询连接状态

**接口**: `POST /api/conntrack/query`

**请求体**:
```json
{
    "protocol": "TCP",
    "sourceIp": "192.168.1.226",
    "sourcePort": "5672",
    "targetIp": "172.16.11.105",
    "targetPort": "56606"
}
```

**响应**:
```json
{
    "success": true,
    "message": "查询成功",
    "data": {
        "status": "ESTABLISHED",
        "originSourceIp": ["172.17.0.3", "172.17.0.4"],
        "podInfoList": [
            {
                "podIp": "172.17.0.3",
                "podName": "alertcenter-765f4d54dc-vlswp",
                "namespace": "test-devops",
                "node": "node-1",
                "status": "Running"
            }
        ]
    }
}
```

#### 2. 服务状态

**接口**: `GET /api/conntrack/status`

**响应**:
```json
{
    "success": true,
    "data": {
        "service": "conntrack-query-service",
        "status": "running",
        "version": "1.0.0",
        "agentPort": 9358
    }
}
```

#### 3. 健康检查

**接口**: `GET /health`

**响应**:
```json
{
    "status": "healthy",
    "service": "pod-real-time-query-check-agent"
}
```

### 前端集成后端

要让前端调用后端 API，需要修改 `real-time-js/script.js` 中的 `queryConnectionStatus` 函数：

```javascript
// 修改为调用后端 API
async function queryConnectionStatus(params) {
    try {
        const response = await fetch('http://localhost:5000/api/conntrack/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('API 调用失败:', error);
        // 降级到模拟数据
        return mockData[params.protocol] || mockData['TCP'];
    }
}
```

### 后端项目结构

```
real-time-py/
├── app/
│   ├── __init__.py      # Flask 应用初始化
│   ├── routes.py        # API 路由定义
│   ├── models.py        # 数据模型
│   ├── validators.py    # 参数验证
│   └── services.py      # 业务逻辑服务
├── config.py            # 配置管理
├── main.py              # 应用入口
├── requirements.txt     # Python 依赖
├── env.sample           # 环境变量示例
├── Dockerfile           # Docker 镜像构建
└── README.md            # 后端详细文档
```

### Docker 部署

#### 使用 Docker 运行后端

```bash
cd real-time-py

# 构建镜像
docker build -t pod-query-agent:latest .

# 运行容器
docker run -d -p 5000:5000 \
  -e FLASK_ENV=production \
  -e FLASK_DEBUG=False \
  pod-query-agent:latest
```

### K8s API 集成

当前版本使用模拟数据。要集成真实的 Kubernetes API，请在 `real-time-py/app/services.py` 中实现：

```python
from kubernetes import client, config

class K8sService:
    def __init__(self):
        # 集群内运行
        config.load_incluster_config()
        # 或集群外运行
        # config.load_kube_config()
        
        self.v1 = client.CoreV1Api()
    
    def query_pod_by_ip(self, ip: str):
        pods = self.v1.list_pod_for_all_namespaces()
        for pod in pods.items:
            if pod.status.pod_ip == ip:
                return {
                    'podIp': pod.status.pod_ip,
                    'podName': pod.metadata.name,
                    'namespace': pod.metadata.namespace,
                    'node': pod.spec.node_name,
                    'status': pod.status.phase
                }
        return None
```

### 生产环境部署

#### 使用 Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

#### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 安全建议

生产环境部署时请注意：

1. **修改密钥**: 更改 `.env` 文件中的 `SECRET_KEY`
2. **配置 CORS**: 设置具体的允许源，而不是 `*`
3. **启用 HTTPS**: 使用 SSL/TLS 证书
4. **添加认证**: 实现 API 密钥或 JWT 认证
5. **K8s 权限**: 配置合适的 RBAC 权限

### 更多信息

详细的后端文档请查看 [real-time-py/README.md](real-time-py/README.md)

---

## 📚 完整使用流程

### 1. 启动后端服务

```bash
cd real-time-py
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 2. 启动前端服务

```bash
cd real-time-js
python -m http.server 8000
```

### 3. 访问应用

打开浏览器访问 `http://localhost:8000`

### 4. 测试查询

1. 填写查询参数
2. 点击"查询连接状态"按钮
3. 查看从后端 API 返回的实时数据

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 创建 Pull Request
- 邮箱: support@example.com

---

**注意**: 在生产环境中使用时，请确保：
- ✅ 连接真实的后端 API 或 K8s 集群
- ✅ 添加适当的安全措施（HTTPS、认证等）
- ✅ 实现完整的错误处理和日志记录
- ✅ 添加监控和性能优化
- ✅ 配置合适的 RBAC 权限

💡 **提示**：如有问题或建议，欢迎反馈！
