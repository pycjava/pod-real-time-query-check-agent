"""数据模型"""
from typing import List, Union
from dataclasses import dataclass, asdict


@dataclass
class PodInfo:
    """Pod信息模型"""
    podIp: str
    podName: str
    namespace: str
    node: str
    status: str
    
    def to_dict(self):
        """转换为字典"""
        return asdict(self)


@dataclass
class ConnectionStatus:
    """连接状态模型"""
    status: str  # ESTABLISHED, TIME_WAIT, CLOSE_WAIT等
    originSourceIp: Union[str, List[str]]  # 源Pod IP，可以是单个或多个
    podInfoList: List[PodInfo]  # Pod信息列表
    
    def to_dict(self):
        """转换为字典"""
        return {
            'status': self.status,
            'originSourceIp': self.originSourceIp,
            'podInfoList': [pod.to_dict() for pod in self.podInfoList]
        }


# 模拟数据 - 实际应用中应该从K8s API或Agent获取
MOCK_DATA = {
    'TCP': ConnectionStatus(
        status='ESTABLISHED',
        originSourceIp=['172.17.0.3', '172.17.0.4', '172.17.0.5'],
        podInfoList=[
            PodInfo(
                podIp='172.17.0.3',
                podName='alertcenter-765f4d54dc-vlswp',
                namespace='test-devops',
                node='node-1',
                status='Running'
            ),
            PodInfo(
                podIp='172.17.0.4',
                podName='alertcenter-765f4d54dc-abc12',
                namespace='test-devops',
                node='node-2',
                status='Running'
            ),
            PodInfo(
                podIp='172.17.0.5',
                podName='alertcenter-765f4d54dc-xyz89',
                namespace='test-devops',
                node='node-3',
                status='Running'
            )
        ]
    ),
    'UDP': ConnectionStatus(
        status='ESTABLISHED',
        originSourceIp=['172.18.0.5', '172.18.0.6'],
        podInfoList=[
            PodInfo(
                podIp='172.18.0.5',
                podName='service-worker-9a8b7c6d5e-xyz12',
                namespace='production',
                node='node-4',
                status='Running'
            ),
            PodInfo(
                podIp='172.18.0.6',
                podName='service-worker-9a8b7c6d5e-def45',
                namespace='production',
                node='node-5',
                status='Running'
            )
        ]
    ),
    'ICMP': ConnectionStatus(
        status='TIME_WAIT',
        originSourceIp='172.19.0.8',
        podInfoList=[
            PodInfo(
                podIp='172.19.0.8',
                podName='network-monitor-12ab34cd56-pqr78',
                namespace='monitoring',
                node='node-6',
                status='Running'
            )
        ]
    )
}

