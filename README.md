# 容器连接跟踪事件实时查询系统

一个用于统一查询多个 Agent 的连接跟踪信息、定位源 Pod 的 Web 应用程序。

## 功能特性

- 🔍 **实时查询**: 查询容器连接跟踪事件状态
- 🌐 **多协议支持**: 支持 TCP、UDP、ICMP 协议
- 📊 **详细信息**: 显示连接状态、源 Pod IP 和完整的 Pod 信息
- ✨ **现代UI**: 美观的渐变设计和流畅的交互动画
- 📱 **响应式设计**: 完美支持桌面和移动设备
- ✅ **表单验证**: 实时验证 IP 地址和端口号格式
- 🔗 **URL 参数支持**: 支持从 URL 参数自动填充表单并查询
- 📋 **链接分享**: 一键复制查询链接，方便分享查询结果
- 📑 **多 Pod 标签页**: 支持多个 Pod 信息的标签页切换显示

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

## 技术栈

- **HTML5**: 语义化标记
- **CSS3**: 现代样式、渐变、动画
- **JavaScript (ES6+)**: 原生 JavaScript，无框架依赖

## 快速开始

### 安装

无需任何依赖安装，这是一个纯静态的 Web 应用。

### 运行

1. **使用本地服务器**（推荐）

```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Python 2
python -m SimpleHTTPServer 8000

# 使用 Node.js (需要先安装 http-server)
npx http-server -p 8000
```

2. **直接打开**

双击 `index.html` 文件在浏览器中打开。

3. **访问应用**

打开浏览器访问 `http://localhost:8000`

## 使用说明

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

## 项目结构

```
sql源地址查询/
│
├── index.html          # 主 HTML 文件
├── style.css           # 样式文件
├── script.js           # JavaScript 逻辑
└── README.md           # 项目说明文档
```

## 文件说明

### index.html
包含完整的页面结构：
- 页面头部和标题
- 查询参数表单
- 查询结果展示区域
- 页脚信息

### style.css
提供完整的样式定义：
- 全局样式和布局
- 表单组件样式
- 结果展示样式
- 响应式设计
- 动画效果

### script.js
实现所有交互逻辑：
- 表单验证（IP 和端口）
- 表单提交处理
- 结果展示更新
- 错误提示管理
- API 调用接口（预留）
- URL 参数解析和自动填充
- 分享链接生成和复制
- Toast 提示显示

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

## API 集成

当前版本使用模拟数据进行演示。要集成实际的后端 API：

1. 在 `script.js` 中找到 `queryConnectionStatus` 函数
2. 取消注释 API 调用代码
3. 修改 API 端点 URL
4. 根据实际 API 响应格式调整数据处理逻辑

### API 请求格式示例

```javascript
{
  "protocol": "TCP",
  "sourceIp": "192.168.1.226",
  "sourcePort": "5672",
  "targetIp": "172.16.11.105",
  "targetPort": "56606"
}
```

### API 响应格式示例

```javascript
{
  "status": "ESTABLISHED",
  "originSourceIp": "172.17.0.3",
  "podInfo": {
    "podIp": "172.17.0.3",
    "podName": "alertcenter-765f4d54dc-vlswp",
    "namespace": "test-devops"
  }
}
```

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

## 常见问题

### Q: 为什么查询后没有显示真实数据？
**A**: 当前版本使用模拟数据。请参考"API 集成"部分连接实际后端服务。

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

**注意**: 这是一个前端演示项目。在生产环境中使用时，请确保：
- 连接真实的后端 API
- 添加适当的安全措施（HTTPS、认证等）
- 实现错误处理和日志记录
- 添加监控和性能优化

💡 **提示**：如有问题或建议，欢迎反馈！
