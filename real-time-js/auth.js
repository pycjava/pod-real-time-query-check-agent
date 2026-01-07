/**
 * 身份验证工具模块
 * 用于检查用户登录状态和管理认证令牌
 */

const AUTH_CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    TOKEN_KEY: 'auth_token',
    USER_INFO_KEY: 'user_info',
    LOGIN_PAGE: 'login.html'
};

/**
 * 获取存储的认证令牌
 */
function getAuthToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    const userInfoStr = localStorage.getItem(AUTH_CONFIG.USER_INFO_KEY);
    if (!userInfoStr) return null;
    
    try {
        return JSON.parse(userInfoStr);
    } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
    }
}

/**
 * 保存认证令牌和用户信息
 */
function saveAuthInfo(token, userInfo) {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 清除认证信息
 */
function clearAuthInfo() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_INFO_KEY);
}

/**
 * 验证令牌是否有效
 */
async function verifyToken(token) {
    if (!token) return false;

    try {
        console.log('调用后端验证 API:', `${AUTH_CONFIG.API_BASE_URL}/auth/verify`);
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('后端响应状态:', response.status);
        const result = await response.json();
        console.log('后端响应内容:', result);
        return result.success === true;

    } catch (error) {
        console.error('验证令牌失败:', error);
        return false;
    }
}

/**
 * 检查用户是否已登录，未登录则跳转到登录页面
 */
async function requireAuth() {
    console.log('开始检查登录状态...');
    const token = getAuthToken();
    console.log('当前 Token:', token);

    if (!token) {
        // 没有令牌，跳转到登录页
        console.log('未找到 Token，跳转到登录页');
        redirectToLogin();
        return false;
    }

    // 验证令牌是否有效
    console.log('验证 Token 有效性...');
    const isValid = await verifyToken(token);
    console.log('Token 验证结果:', isValid);

    if (!isValid) {
        // 令牌无效，清除并跳转到登录页
        console.log('Token 无效，清除并跳转到登录页');
        clearAuthInfo();
        redirectToLogin();
        return false;
    }

    console.log('登录验证成功！');
    return true;
}

/**
 * 跳转到登录页面
 */
function redirectToLogin() {
    // 隐藏加载遮罩层（如果存在）
    const authLoadingOverlay = document.getElementById('authLoadingOverlay');
    if (authLoadingOverlay) {
        authLoadingOverlay.style.display = 'none';
    }
    
    // 保存当前页面URL，登录后可以返回
    const currentUrl = window.location.href;
    const returnUrl = encodeURIComponent(currentUrl);
    
    console.log('准备跳转到登录页:', AUTH_CONFIG.LOGIN_PAGE);
    window.location.href = `${AUTH_CONFIG.LOGIN_PAGE}?return=${returnUrl}`;
}

/**
 * 退出登录
 */
async function logout() {
    const token = getAuthToken();

    if (token) {
        try {
            // 通知服务器登出
            await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('登出请求失败:', error);
        }
    }

    // 清除本地认证信息
    clearAuthInfo();

    // 跳转到登录页
    window.location.href = AUTH_CONFIG.LOGIN_PAGE;
}

/**
 * 为所有 API 请求添加认证头
 */
function addAuthHeader(headers = {}) {
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * 带认证的 fetch 请求封装
 */
async function authenticatedFetch(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('未登录');
    }

    // 添加认证头
    options.headers = addAuthHeader(options.headers || {});

    try {
        const response = await fetch(url, options);

        // 如果返回 401，说明令牌失效
        if (response.status === 401) {
            clearAuthInfo();
            redirectToLogin();
            throw new Error('认证失败，请重新登录');
        }

        return response;

    } catch (error) {
        console.error('请求失败:', error);
        throw error;
    }
}

/**
 * 在页面头部显示用户信息
 */
function displayUserInfo(containerSelector = '.header') {
    const userInfo = getUserInfo();
    if (!userInfo) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    // 创建用户信息显示元素
    const userInfoElement = document.createElement('div');
    userInfoElement.className = 'user-info';
    userInfoElement.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
    `;

    // 判断是否有微信头像URL（可能是 headimgurl 或 avatarUrl）
    const avatarUrl = userInfo.headimgurl || userInfo.avatarUrl || userInfo.avatar;
    
    // 如果有头像URL，显示真实头像；否则显示首字母
    const avatarHtml = avatarUrl 
        ? `<img src="${avatarUrl}" alt="用户头像" style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #10b981;
        " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="user-avatar-fallback" style="
            display: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #10b981;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        ">
            ${userInfo.nickname ? userInfo.nickname.charAt(0) : '用'}
        </div>`
        : `<div class="user-avatar" style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 14px;
        ">
            ${userInfo.nickname ? userInfo.nickname.charAt(0) : '用'}
        </div>`;

    userInfoElement.innerHTML = `
        <div class="user-avatar-container" style="position: relative;">
            ${avatarHtml}
        </div>
        <div class="user-details" style="display: flex; flex-direction: column;">
            <span style="font-size: 14px; font-weight: 600; color: #1f2937;">
                ${userInfo.nickname || '微信用户'}
            </span>
        </div>
        <button id="logoutBtn" class="logout-btn" style="
            padding: 6px 16px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            退出登录
        </button>
    `;

    // 调整 header 为 flex 布局
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    
    container.appendChild(userInfoElement);

    // 绑定退出登录事件
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
    logoutBtn.addEventListener('mouseenter', function() {
        this.style.background = '#dc2626';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
    });
    logoutBtn.addEventListener('mouseleave', function() {
        this.style.background = '#ef4444';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAuthToken,
        getUserInfo,
        saveAuthInfo,
        clearAuthInfo,
        verifyToken,
        requireAuth,
        redirectToLogin,
        logout,
        addAuthHeader,
        authenticatedFetch,
        displayUserInfo
    };
}
