# Pod 实时查询检查 Agent - Flask 后端

这是一个用于查询 Kubernetes 服务器连接状态的 Flask 后端服务，可以查询容器连接跟踪事件，定位源 Pod 信息。

## 功能特性

- ✅ 查询连接状态（TCP/UDP/ICMP）
- ✅ 支持多个源 Pod IP 返回
- ✅ 获取 Pod 详细信息（Pod IP、Name、Namespace、Node、Status）
- ✅ 参数验证（IP 地址、端口号、协议类型）
- ✅ RESTful API 接口
- ✅ CORS 跨域支持
- ✅ 日志记录
- ✅ 错误处理

## 技术栈

- **Flask 3.0** - Web 框架
- **Flask-CORS** - 跨域资源共享
- **Python 3.8+** - 编程语言
- **Kubernetes Client** - K8s API 客户端（可选）

## 项目结构

```
real-time-py/
├── app/
│   ├── __init__.py          # Flask 应用初始化
│   ├── routes.py            # API 路由定义
│   ├── models.py            # 数据模型
│   ├── validators.py        # 参数验证
│   └── services.py          # 业务逻辑服务
├── config.py                # 配置文件
├── main.py                  # 应用入口
├── requirements.txt         # 依赖包
├── .env.example            # 环境变量示例
├── .gitignore              # Git 忽略文件
└── README.md               # 说明文档
```

## 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖包
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```ini
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=*
```

### 3. 运行应用

```bash
python main.py
```

服务将在 `http://localhost:5000` 启动。

### 4. 生产环境部署

使用 Gunicorn 运行：

```bash
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

## API 接口文档

### 1. 查询连接状态

**接口地址**: `POST /api/conntrack/query`

**请求头**:
```
Content-Type: application/json
```

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

**参数说明**:
- `protocol`: 协议类型，必填，可选值：TCP、UDP、ICMP
- `sourceIp`: 源 IP 地址，必填，格式：xxx.xxx.xxx.xxx
- `sourcePort`: 源端口号，必填，范围：1-65535
- `targetIp`: 目标 IP 地址，必填，格式：xxx.xxx.xxx.xxx
- `targetPort`: 目标端口号，必填，范围：1-65535

**成功响应** (200):
```json
{
    "success": true,
    "message": "查询成功",
    "data": {
        "status": "ESTABLISHED",
        "originSourceIp": ["172.17.0.3", "172.17.0.4", "172.17.0.5"],
        "podInfoList": [
            {
                "podIp": "172.17.0.3",
                "podName": "alertcenter-765f4d54dc-vlswp",
                "namespace": "test-devops",
                "node": "node-1",
                "status": "Running"
            },
            {
                "podIp": "172.17.0.4",
                "podName": "alertcenter-765f4d54dc-abc12",
                "namespace": "test-devops",
                "node": "node-2",
                "status": "Running"
            }
        ]
    }
}
```

**错误响应** (400):
```json
{
    "success": false,
    "error": "源IP地址错误: IP地址格式不正确",
    "code": "VALIDATION_ERROR"
}
```

**错误响应** (404):
```json
{
    "success": false,
    "error": "未找到连接信息",
    "code": "NOT_FOUND"
}
```

**错误响应** (500):
```json
{
    "success": false,
    "error": "服务器内部错误",
    "code": "INTERNAL_ERROR"
}
```

### 2. 获取服务状态

**接口地址**: `GET /api/conntrack/status`

**成功响应** (200):
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

### 3. 健康检查

**接口地址**: `GET /health`

**成功响应** (200):
```json
{
    "status": "healthy",
    "service": "pod-real-time-query-check-agent"
}
```

## 测试接口

使用 curl 测试：

```bash
# 查询连接状态
curl -X POST http://localhost:5000/api/conntrack/query \
  -H "Content-Type: application/json" \
  -d '{
    "protocol": "TCP",
    "sourceIp": "192.168.1.226",
    "sourcePort": "5672",
    "targetIp": "172.16.11.105",
    "targetPort": "56606"
  }'

# 获取服务状态
curl http://localhost:5000/api/conntrack/status

# 健康检查
curl http://localhost:5000/health
```

使用 Python 测试：

```python
import requests

# 查询连接状态
response = requests.post('http://localhost:5000/api/conntrack/query', json={
    'protocol': 'TCP',
    'sourceIp': '192.168.1.226',
    'sourcePort': '5672',
    'targetIp': '172.16.11.105',
    'targetPort': '56606'
})

print(response.json())
```

## 集成 Kubernetes API

当前版本使用模拟数据。要集成真实的 Kubernetes API，请在 `app/services.py` 中实现以下功能：

1. **初始化 K8s 客户端**：
```python
from kubernetes import client, config

# 集群内运行
config.load_incluster_config()

# 集群外运行
config.load_kube_config()

v1 = client.CoreV1Api()
```

2. **查询 Pod 信息**：
```python
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

3. **调用 Agent API**：
```python
import requests

agent_url = f"http://{target_ip}:{AGENT_PORT}/api/conntrack/query"
response = requests.post(agent_url, json=params, timeout=5)
```

## Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
```

构建和运行：

```bash
# 构建镜像
docker build -t pod-query-agent:latest .

# 运行容器
docker run -d -p 5000:5000 \
  -e FLASK_ENV=production \
  -e FLASK_DEBUG=False \
  pod-query-agent:latest
```

## 注意事项

1. **安全性**：
   - 生产环境请修改 `SECRET_KEY`
   - 配置正确的 CORS 源
   - 启用 HTTPS
   - 添加认证授权机制

2. **性能优化**：
   - 使用 Gunicorn 多进程部署
   - 添加缓存机制
   - 配置连接池

3. **监控日志**：
   - 配置日志级别和输出
   - 集成监控系统
   - 记录关键操作

4. **K8s 集成**：
   - 配置正确的 RBAC 权限
   - 使用 ServiceAccount
   - 处理 API 超时和错误

## 开发说明

### 目录说明

- `app/__init__.py`: Flask 应用工厂，初始化应用和扩展
- `app/routes.py`: API 路由定义，处理 HTTP 请求
- `app/models.py`: 数据模型定义和模拟数据
- `app/validators.py`: 参数验证函数
- `app/services.py`: 业务逻辑服务层
- `config.py`: 应用配置
- `main.py`: 应用入口

### 添加新接口

1. 在 `app/routes.py` 中定义路由
2. 在 `app/services.py` 中实现业务逻辑
3. 在 `app/validators.py` 中添加验证函数
4. 更新 README 文档

## 许可证

MIT License

## 联系方式

如有问题，请提交 Issue 或 Pull Request。

