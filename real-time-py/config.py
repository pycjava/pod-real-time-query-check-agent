"""配置文件"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """基础配置"""
    # Flask配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # CORS配置
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
    
    # API配置
    API_PREFIX = '/api'
    
    # K8s配置
    K8S_IN_CLUSTER = os.environ.get('K8S_IN_CLUSTER', 'False').lower() == 'true'
    K8S_CONFIG_PATH = os.environ.get('K8S_CONFIG_PATH', '~/.kube/config')
    
    # Agent配置
    AGENT_PORT = int(os.environ.get('AGENT_PORT', 9358))
    AGENT_TIMEOUT = int(os.environ.get('AGENT_TIMEOUT', 5))


class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True


class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False


# 配置字典
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

