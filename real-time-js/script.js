// DOM 元素
const queryForm = document.getElementById('queryForm');
const resultSection = document.getElementById('resultSection');
const connectionStatus = document.getElementById('connectionStatus');
const originSourceIpContainer = document.getElementById('originSourceIpContainer');
const podCountBadge = document.getElementById('podCountBadge');
const tabsNav = document.getElementById('tabsNav');
const tabsContent = document.getElementById('tabsContent');
const queryConsultBtn = document.getElementById('queryConsultBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');

// 模拟数据 - 实际应用中应该从后端API获取
const mockData = {
    'TCP': {
        status: 'ESTABLISHED',
        originSourceIp: ['172.17.0.3', '172.17.0.4', '172.17.0.5'], // 多个 IP 地址
        podInfoList: [ // 多个 Pod 信息
            {
                podIp: '172.17.0.3',
                podName: 'alertcenter-765f4d54dc-vlswp',
                namespace: 'test-devops',
                node: 'node-1',
                status: 'Running'
            },
            {
                podIp: '172.17.0.4',
                podName: 'alertcenter-765f4d54dc-abc12',
                namespace: 'test-devops',
                node: 'node-2',
                status: 'Running'
            },
            {
                podIp: '172.17.0.5',
                podName: 'alertcenter-765f4d54dc-xyz89',
                namespace: 'test-devops',
                node: 'node-3',
                status: 'Running'
            }
        ]
    },
    'UDP': {
        status: 'ESTABLISHED',
        originSourceIp: ['172.18.0.5', '172.18.0.6'], // 两个 IP 地址
        podInfoList: [
            {
                podIp: '172.18.0.5',
                podName: 'service-worker-9a8b7c6d5e-xyz12',
                namespace: 'production',
                node: 'node-4',
                status: 'Running'
            },
            {
                podIp: '172.18.0.6',
                podName: 'service-worker-9a8b7c6d5e-def45',
                namespace: 'production',
                node: 'node-5',
                status: 'Running'
            }
        ]
    },
    'ICMP': {
        status: 'TIME_WAIT',
        originSourceIp: '172.19.0.8', // 单个 IP 地址
        podInfoList: [ // 单个 Pod
            {
                podIp: '172.19.0.8',
                podName: 'network-monitor-12ab34cd56-pqr78',
                namespace: 'monitoring',
                node: 'node-6',
                status: 'Running'
            }
        ]
    }
};

// 表单验证
function validateIP(ip) {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255;
    });
}

function validatePort(port) {
    const portNum = parseInt(port);
    return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
}

// 显示错误提示
function showError(input, message) {
    const formGroup = input.parentElement;

    // 移除之前的错误提示
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 添加错误样式
    input.style.borderColor = '#ef4444';

    // 创建错误消息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;

    formGroup.appendChild(errorDiv);
}

// 清除错误提示
function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    input.style.borderColor = '#d1d5db';
}

// 显示 Toast 提示
function showToast(message, duration = 3000) {
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>${message}</span>
    `;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 显示源 IP 地址（支持单个或多个）
function displayOriginSourceIPs(ipData) {
    // 清空容器
    originSourceIpContainer.innerHTML = '';

    // 判断是数组还是字符串
    const ipArray = Array.isArray(ipData) ? ipData : [ipData];

    // 多个 IP 使用标签样式显示
    ipArray.forEach((ip, index) => {
        const ipBadge = document.createElement('div');
        ipBadge.className = 'ip-badge';
        ipBadge.innerHTML = `
            <span class="ip-badge-label">IP ${index + 1}</span>
            <span class="ip-badge-value">${ip}</span>
        `;
        originSourceIpContainer.appendChild(ipBadge);
    });
}

// 显示 Pod 信息标签页
function displayPodTabs(podInfoList) {
    // 清空容器
    tabsNav.innerHTML = '';
    tabsContent.innerHTML = '';

    // 更新 Pod 数量徽章
    podCountBadge.textContent = podInfoList.length;

    // 创建标签页
    podInfoList.forEach((pod, index) => {
        // 创建标签按钮
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
        tabButton.setAttribute('data-tab', index);
        tabButton.innerHTML = `
            <span class="tab-icon">📦</span>
            <span class="tab-label">Pod ${index + 1}</span>
        `;
        tabButton.addEventListener('click', () => switchTab(index));
        tabsNav.appendChild(tabButton);

        // 创建标签内容
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane ${index === 0 ? 'active' : ''}`;
        tabPane.setAttribute('data-pane', index);
        tabPane.innerHTML = `
            <div class="info-row">
                <span class="info-label">Pod IP</span>
                <span class="info-value">${pod.podIp}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pod Name</span>
                <span class="info-value">${pod.podName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Namespace</span>
                <span class="info-value">${pod.namespace}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Node</span>
                <span class="info-value">${pod.node}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value status-${pod.status.toLowerCase()}">${pod.status}</span>
            </div>
        `;
        tabsContent.appendChild(tabPane);
    });
}

// 切换标签页
function switchTab(tabIndex) {
    // 更新标签按钮状态
    const allButtons = tabsNav.querySelectorAll('.tab-button');
    allButtons.forEach((btn, index) => {
        if (index === tabIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 更新标签内容状态
    const allPanes = tabsContent.querySelectorAll('.tab-pane');
    allPanes.forEach((pane, index) => {
        if (index === tabIndex) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

// 表单提交处理
queryForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 获取表单值
    const protocol = document.getElementById('protocol').value;
    const sourceIp = document.getElementById('sourceIp').value.trim();
    const sourcePort = document.getElementById('sourcePort').value.trim();
    const targetIp = document.getElementById('targetIp').value.trim();
    const targetPort = document.getElementById('targetPort').value.trim();

    // 清除之前的错误
    const inputs = queryForm.querySelectorAll('.form-control');
    inputs.forEach(input => clearError(input));

    // 验证
    let hasError = false;

    if (!validateIP(sourceIp)) {
        showError(document.getElementById('sourceIp'), '请输入有效的IP地址');
        hasError = true;
    }

    if (!validatePort(sourcePort)) {
        showError(document.getElementById('sourcePort'), '请输入有效的端口号 (1-65535)');
        hasError = true;
    }

    if (!validateIP(targetIp)) {
        showError(document.getElementById('targetIp'), '请输入有效的IP地址');
        hasError = true;
    }

    if (!validatePort(targetPort)) {
        showError(document.getElementById('targetPort'), '请输入有效的端口号 (1-65535)');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // 显示加载状态
    const submitBtn = queryForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading"></div> 查询中...';

    // 模拟API调用延迟
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // 获取模拟数据
    // const data = mockData[protocol] || mockData['TCP'];

    let data;

    // 调用 API 查询数据
    try {
        const response = await queryConnectionStatus({
            protocol: protocol,
            sourceIp: sourceIp,
            sourcePort: sourcePort,
            targetIp: targetIp,
            targetPort: targetPort
        });


        if (response.success) {
            // API 调用成功
            data = response.data;
        } else {
            // API 返回错误，使用模拟数据
            console.error('API 查询失败:', response.error);
            alert('查询失败: ' + response.error + '\n使用模拟数据显示');
            data = mockData[protocol] || mockData['TCP'];
        }

    } catch (error) {
        // 网络错误或其他异常
        console.error('API 调用异常:', error);
        alert('无法连接到后端服务\n' + error.message + '\n使用模拟数据显示');
        data = mockData[protocol] || mockData['TCP'];
    }

    // 继续后续的显示逻辑
    // 更新结果显示
    connectionStatus.textContent = data.status;

    // 处理单个或多个 IP 地址
    displayOriginSourceIPs(data.originSourceIp);

    // 显示 Pod 信息标签页
    displayPodTabs(data.podInfoList);

    // 根据状态设置颜色
    const statusColors = {
        'ESTABLISHED': { bg: '#d1fae5', color: '#065f46' },
        'TIME_WAIT': { bg: '#fef3c7', color: '#92400e' },
        'CLOSE_WAIT': { bg: '#fee2e2', color: '#991b1b' }
    };

    const statusColor = statusColors[data.status] || statusColors['ESTABLISHED'];
    connectionStatus.style.background = statusColor.bg;
    connectionStatus.style.color = statusColor.color;

    // 显示结果区域
    resultSection.style.display = 'block';

    // 滚动到结果区域
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // 恢复按钮状态
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
});

// 输入框实时验证
document.getElementById('sourceIp').addEventListener('blur', function () {
    if (this.value.trim() && !validateIP(this.value.trim())) {
        showError(this, '请输入有效的IP地址');
    } else {
        clearError(this);
    }
});

document.getElementById('targetIp').addEventListener('blur', function () {
    if (this.value.trim() && !validateIP(this.value.trim())) {
        showError(this, '请输入有效的IP地址');
    } else {
        clearError(this);
    }
});

document.getElementById('sourcePort').addEventListener('blur', function () {
    if (this.value.trim() && !validatePort(this.value.trim())) {
        showError(this, '请输入有效的端口号 (1-65535)');
    } else {
        clearError(this);
    }
});

document.getElementById('targetPort').addEventListener('blur', function () {
    if (this.value.trim() && !validatePort(this.value.trim())) {
        showError(this, '请输入有效的端口号 (1-65535)');
    } else {
        clearError(this);
    }
});

// 查询咨询按钮点击事件
queryConsultBtn.addEventListener('click', function () {
    // 获取所有显示的 IP 地址
    const ipElements = originSourceIpContainer.querySelectorAll('.result-ip, .ip-badge-value');
    const originIps = Array.from(ipElements).map(el => el.textContent.trim());

    // 获取所有 Pod 信息
    const allPods = [];
    const allPanes = tabsContent.querySelectorAll('.tab-pane');
    allPanes.forEach(pane => {
        const infoRows = pane.querySelectorAll('.info-row');
        const podData = {};
        infoRows.forEach(row => {
            const label = row.querySelector('.info-label').textContent.trim();
            const value = row.querySelector('.info-value').textContent.trim();
            podData[label] = value;
        });
        allPods.push(podData);
    });

    console.log('查询咨询数据:', { status: connectionStatus.textContent, originIps, pods: allPods });

    // 构建展示信息
    const ipList = originIps.length > 1
        ? originIps.map((ip, i) => `  IP ${i + 1}: ${ip}`).join('\n')
        : originIps[0];

    const podList = allPods.map((pod, i) =>
        `\nPod ${i + 1}:\n` +
        `  Pod IP: ${pod['Pod IP']}\n` +
        `  Pod Name: ${pod['Pod Name']}\n` +
        `  Namespace: ${pod['Namespace']}\n` +
        `  Node: ${pod['Node']}\n` +
        `  Status: ${pod['Status']}`
    ).join('\n');

    alert('查询信息已准备好！\n\n' +
        `状态: ${connectionStatus.textContent}\n\n` +
        `源 Pod IP:\n${ipList}\n` +
        `${podList}`);
});

// 分享按钮点击事件
shareBtn.addEventListener('click', function () {
    // 获取当前查询参数，生成分享链接
    const protocol = document.getElementById('protocol').value;
    const sourceIp = document.getElementById('sourceIp').value;
    const sourcePort = document.getElementById('sourcePort').value;
    const targetIp = document.getElementById('targetIp').value;
    const targetPort = document.getElementById('targetPort').value;
    const shareUrl = generateQueryUrl(protocol, sourceIp, sourcePort, targetIp, targetPort);

    // 复制链接到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
        // 显示成功提示
        showToast('✨ 分享链接已复制到剪贴板');

        // 按钮添加成功动画
        shareBtn.classList.add('share-success');
        setTimeout(() => {
            shareBtn.classList.remove('share-success');
        }, 500);

        console.log('分享链接已复制:', shareUrl);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制链接失败，请手动复制：\n' + shareUrl);
    });
});

// 从 URL 参数获取查询参数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        protocol: params.get('protocol'),
        sourceIp: params.get('sourceIp'),
        sourcePort: params.get('sourcePort'),
        targetIp: params.get('targetIp'),
        targetPort: params.get('targetPort')
    };
}

// 填充表单并自动查询
async function fillFormFromUrlAndQuery() {
    const params = getUrlParams();

    // 检查是否有URL参数
    const hasParams = params.protocol || params.sourceIp || params.sourcePort ||
        params.targetIp || params.targetPort;

    if (!hasParams) {
        return; // 没有参数，不执行任何操作
    }

    console.log('从URL参数加载查询:', params);

    // 填充表单字段
    if (params.protocol) {
        document.getElementById('protocol').value = params.protocol;
    }
    if (params.sourceIp) {
        document.getElementById('sourceIp').value = params.sourceIp;
    }
    if (params.sourcePort) {
        document.getElementById('sourcePort').value = params.sourcePort;
    }
    if (params.targetIp) {
        document.getElementById('targetIp').value = params.targetIp;
    }
    if (params.targetPort) {
        document.getElementById('targetPort').value = params.targetPort;
    }

    // 延迟一小段时间，让页面完全加载
    await new Promise(resolve => setTimeout(resolve, 300));

    // 自动触发查询
    const submitBtn = queryForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        // 触发表单提交事件
        queryForm.dispatchEvent(new Event('submit'));

        // 等待结果显示后滚动到结果区域
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (resultSection.style.display !== 'none') {
            resultSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// 生成带参数的查询链接（工具函数）
function generateQueryUrl(protocol, sourceIp, sourcePort, targetIp, targetPort) {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
        protocol: protocol,
        sourceIp: sourceIp,
        sourcePort: sourcePort,
        targetIp: targetIp,
        targetPort: targetPort
    });
    return `${baseUrl}?${params.toString()}`;
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', async function () {
    console.log('容器连接跟踪查询系统已加载');

    // 从URL参数预填充表单并自动查询
    await fillFormFromUrlAndQuery();
});

// API 集成函数 (实际使用时替换模拟数据)
// API 集成函数
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

        return await response.json();

    } catch (error) {
        console.error('API 调用失败:', error);
        // 返回错误格式
        return {
            success: false,
            error: error.message
        };
    }
}
// async function queryConnectionStatus(params) {
// 实际使用时，这里应该调用后端API
//     const response = await fetch('/api/conntrack/query', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(params)
//     });
//     return await response.json();

// 当前返回模拟数据
// return mockData[params.protocol] || mockData['TCP'];
// }

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateIP,
        validatePort,
        queryConnectionStatus
    };
}

