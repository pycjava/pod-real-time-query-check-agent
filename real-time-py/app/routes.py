"""API路由定义"""
import logging
import uuid
import time
from flask import Blueprint, request, jsonify
from app.validators import validate_query_params
from app.services import ConntrackService
from functools import wraps

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 创建蓝图
api_bp = Blueprint('api', __name__)

# 初始化服务
conntrack_service = ConntrackService()

# 临时存储：在实际应用中应使用 Redis 等缓存数据库
# 格式: { ticket: { status: 'pending', user_info: None, token: None, created_at: timestamp } }
qr_sessions = {}
# 格式: { token: { user_info: {...}, created_at: timestamp } }
user_sessions = {}


# 认证装饰器
def require_auth(f):
    """验证请求的认证令牌"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': '未提供认证令牌',
                'code': 'UNAUTHORIZED'
            }), 401
        
        token = auth_header.split(' ')[1]
        
        # 验证 token
        if token not in user_sessions:
            return jsonify({
                'success': False,
                'error': '认证令牌无效或已过期',
                'code': 'INVALID_TOKEN'
            }), 401
        
        # 将用户信息添加到请求上下文
        request.user_info = user_sessions[token]['user_info']
        
        return f(*args, **kwargs)
    
    return decorated_function


@api_bp.route('/auth/wechat/qrcode', methods=['POST'])
def generate_wechat_qrcode():
    """
    生成微信登录二维码
    
    返回:
        {
            "success": true,
            "data": {
                "ticket": "uuid-string",
                "qrUrl": "weixin://scan?ticket=xxx",
                "expireTime": 300
            }
        }
    """
    try:
        # 生成唯一票据
        ticket = str(uuid.uuid4())
        
        # 在实际应用中，这里应该调用微信 API 生成真实的登录二维码
        # 这里使用模拟的二维码 URL
        qr_url = f"weixin://login?ticket={ticket}&app_id=your_app_id"
        
        # 存储会话信息
        qr_sessions[ticket] = {
            'status': 'pending',  # pending, scanned, confirmed, cancelled, expired
            'user_info': None,
            'token': None,
            'created_at': time.time()
        }
        
        logger.info(f"生成登录二维码，票据: {ticket}")
        
        return jsonify({
            'success': True,
            'data': {
                'ticket': ticket,
                'qrUrl': qr_url,
                'expireTime': 300  # 5分钟
            }
        }), 200
        
    except Exception as e:
        logger.error(f"生成二维码失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': '生成二维码失败',
            'code': 'INTERNAL_ERROR'
        }), 500


@api_bp.route('/auth/wechat/check', methods=['GET'])
def check_wechat_login():
    """
    检查微信登录状态
    
    查询参数:
        ticket: 登录票据
    
    返回:
        {
            "success": true,
            "data": {
                "status": "confirmed",
                "token": "auth-token",
                "userInfo": {...}
            }
        }
    """
    try:
        ticket = request.args.get('ticket')
        
        if not ticket:
            return jsonify({
                'success': False,
                'error': '缺少票据参数',
                'code': 'INVALID_REQUEST'
            }), 400
        
        # 检查票据是否存在
        if ticket not in qr_sessions:
            return jsonify({
                'success': False,
                'error': '票据不存在或已过期',
                'code': 'INVALID_TICKET'
            }), 404
        
        session = qr_sessions[ticket]
        
        # 检查是否过期（5分钟）
        if time.time() - session['created_at'] > 300:
            session['status'] = 'expired'
            return jsonify({
                'success': True,
                'data': {
                    'status': 'expired'
                }
            }), 200
        
        # 模拟微信扫码：在实际应用中，这里应该通过微信回调更新状态
        # 为了演示，我们在第一次检查后2秒自动模拟扫码，4秒后模拟确认
        elapsed = time.time() - session['created_at']
        
        # 先检查是否应该确认登录（4秒后）
        if elapsed > 4 and session['status'] in ['pending', 'scanned']:
            # 模拟用户确认登录
            token = str(uuid.uuid4())
            user_info = {
                'openid': 'mock_openid_' + str(uuid.uuid4())[:8],
                'nickname': '微信用户',
                'avatar': 'https://ui-avatars.com/api/?name=WX&background=10b981&color=fff'
            }
            
            session['status'] = 'confirmed'
            session['token'] = token
            session['user_info'] = user_info
            
            # 保存用户会话
            user_sessions[token] = {
                'user_info': user_info,
                'created_at': time.time()
            }
            
            logger.info(f"用户登录成功: {user_info['nickname']}, token: {token}")
            
            return jsonify({
                'success': True,
                'data': {
                    'status': 'confirmed',
                    'token': token,
                    'userInfo': user_info
                }
            }), 200
            
        # 然后检查是否应该显示已扫码（2秒后）
        elif elapsed > 2 and session['status'] == 'pending':
            # 模拟扫码状态
            session['status'] = 'scanned'
            logger.info(f"二维码已被扫描，票据: {ticket}")
        
        # 返回当前状态
        return jsonify({
            'success': True,
            'data': {
                'status': session['status']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"检查登录状态失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': '检查登录状态失败',
            'code': 'INTERNAL_ERROR'
        }), 500


@api_bp.route('/auth/verify', methods=['GET'])
def verify_token():
    """
    验证认证令牌
    
    返回:
        {
            "success": true,
            "data": {
                "valid": true,
                "userInfo": {...}
            }
        }
    """
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': '未提供认证令牌',
                'code': 'UNAUTHORIZED'
            }), 401
        
        token = auth_header.split(' ')[1]
        
        # 验证 token
        if token in user_sessions:
            return jsonify({
                'success': True,
                'data': {
                    'valid': True,
                    'userInfo': user_sessions[token]['user_info']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': '认证令牌无效',
                'code': 'INVALID_TOKEN'
            }), 401
        
    except Exception as e:
        logger.error(f"验证令牌失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': '验证令牌失败',
            'code': 'INTERNAL_ERROR'
        }), 500


@api_bp.route('/auth/logout', methods=['POST'])
@require_auth
def logout():
    """
    用户登出
    
    返回:
        {
            "success": true,
            "message": "登出成功"
        }
    """
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.split(' ')[1]
        
        # 删除用户会话
        if token in user_sessions:
            user_info = user_sessions[token]['user_info']
            del user_sessions[token]
            logger.info(f"用户登出: {user_info.get('nickname', 'Unknown')}")
        
        return jsonify({
            'success': True,
            'message': '登出成功'
        }), 200
        
    except Exception as e:
        logger.error(f"登出失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': '登出失败',
            'code': 'INTERNAL_ERROR'
        }), 500


@api_bp.route('/conntrack/query', methods=['POST'])
@require_auth
def query_connection_status():
    """
    查询连接状态API
    
    请求体:
        {
            "protocol": "TCP",
            "sourceIp": "192.168.1.226",
            "sourcePort": "5672",
            "targetIp": "172.16.11.105",
            "targetPort": "56606"
        }
    
    返回:
        {
            "success": true,
            "data": {
                "status": "ESTABLISHED",
                "originSourceIp": ["172.17.0.3", "172.17.0.4"],
                "podInfoList": [...]
            }
        }
    """
    try:
        # 获取请求数据
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': '请求体不能为空',
                'code': 'INVALID_REQUEST'
            }), 400
        
        logger.info(f"收到查询请求: {data}")
        
        # 验证参数
        valid, error, cleaned_params = validate_query_params(data)
        if not valid:
            return jsonify({
                'success': False,
                'error': error,
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # 查询连接状态
        result = conntrack_service.query_connection_status(
            protocol=cleaned_params['protocol'],
            source_ip=cleaned_params['sourceIp'],
            source_port=cleaned_params['sourcePort'],
            target_ip=cleaned_params['targetIp'],
            target_port=cleaned_params['targetPort']
        )
        
        if result is None:
            return jsonify({
                'success': False,
                'error': '未找到连接信息',
                'code': 'NOT_FOUND'
            }), 404
        
        # 返回结果
        return jsonify({
            'success': True,
            'data': result.to_dict(),
            'message': '查询成功'
        }), 200
        
    except Exception as e:
        logger.error(f"查询失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': '服务器内部错误',
            'code': 'INTERNAL_ERROR',
            'details': str(e) if logger.level == logging.DEBUG else None
        }), 500


@api_bp.route('/conntrack/status', methods=['GET'])
def get_service_status():
    """
    获取服务状态
    
    返回:
        {
            "success": true,
            "data": {
                "service": "conntrack-query-service",
                "status": "running",
                "version": "1.0.0"
            }
        }
    """
    return jsonify({
        'success': True,
        'data': {
            'service': 'conntrack-query-service',
            'status': 'running',
            'version': '1.0.0',
            'agentPort': 9358
        }
    }), 200


@api_bp.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({
        'success': False,
        'error': '接口不存在',
        'code': 'NOT_FOUND'
    }), 404


@api_bp.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    logger.error(f"服务器错误: {str(error)}", exc_info=True)
    return jsonify({
        'success': False,
        'error': '服务器内部错误',
        'code': 'INTERNAL_ERROR'
    }), 500

