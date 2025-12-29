"""API路由定义"""
import logging
from flask import Blueprint, request, jsonify
from app.validators import validate_query_params
from app.services import ConntrackService

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


@api_bp.route('/conntrack/query', methods=['POST'])
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

