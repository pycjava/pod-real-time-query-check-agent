"""验证工具函数"""
import re
from typing import Tuple


def validate_ip(ip: str) -> Tuple[bool, str]:
    """
    验证IP地址格式
    
    Args:
        ip: IP地址字符串
        
    Returns:
        (是否有效, 错误信息)
    """
    if not ip or not isinstance(ip, str):
        return False, "IP地址不能为空"
    
    ip = ip.strip()
    
    # IP地址正则表达式
    ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    if not re.match(ip_pattern, ip):
        return False, "IP地址格式不正确"
    
    # 验证每个部分是否在0-255范围内
    parts = ip.split('.')
    for part in parts:
        num = int(part)
        if num < 0 or num > 255:
            return False, f"IP地址段 {num} 超出范围 (0-255)"
    
    return True, ""


def validate_port(port: str) -> Tuple[bool, str]:
    """
    验证端口号
    
    Args:
        port: 端口号字符串
        
    Returns:
        (是否有效, 错误信息)
    """
    if not port:
        return False, "端口号不能为空"
    
    try:
        port_num = int(port)
        if port_num < 1 or port_num > 65535:
            return False, "端口号必须在 1-65535 范围内"
        return True, ""
    except ValueError:
        return False, "端口号必须是数字"


def validate_protocol(protocol: str) -> Tuple[bool, str]:
    """
    验证协议类型
    
    Args:
        protocol: 协议类型字符串
        
    Returns:
        (是否有效, 错误信息)
    """
    if not protocol:
        return False, "协议类型不能为空"
    
    valid_protocols = ['TCP', 'UDP', 'ICMP']
    protocol = protocol.upper()
    
    if protocol not in valid_protocols:
        return False, f"协议类型必须是 {', '.join(valid_protocols)} 之一"
    
    return True, ""


def validate_query_params(params: dict) -> Tuple[bool, str, dict]:
    """
    验证查询参数
    
    Args:
        params: 查询参数字典
        
    Returns:
        (是否有效, 错误信息, 清理后的参数)
    """
    required_fields = ['protocol', 'sourceIp', 'sourcePort', 'targetIp', 'targetPort']
    
    # 检查必填字段
    for field in required_fields:
        if field not in params or not params[field]:
            return False, f"缺少必填参数: {field}", {}
    
    # 验证协议
    valid, error = validate_protocol(params['protocol'])
    if not valid:
        return False, error, {}
    
    # 验证源IP
    valid, error = validate_ip(params['sourceIp'])
    if not valid:
        return False, f"源IP地址错误: {error}", {}
    
    # 验证目标IP
    valid, error = validate_ip(params['targetIp'])
    if not valid:
        return False, f"目标IP地址错误: {error}", {}
    
    # 验证源端口
    valid, error = validate_port(params['sourcePort'])
    if not valid:
        return False, f"源端口错误: {error}", {}
    
    # 验证目标端口
    valid, error = validate_port(params['targetPort'])
    if not valid:
        return False, f"目标端口错误: {error}", {}
    
    # 返回清理后的参数
    cleaned_params = {
        'protocol': params['protocol'].upper(),
        'sourceIp': params['sourceIp'].strip(),
        'sourcePort': int(params['sourcePort']),
        'targetIp': params['targetIp'].strip(),
        'targetPort': int(params['targetPort'])
    }
    
    return True, "", cleaned_params

