"""应用入口文件"""
import os
import logging
from app import create_app

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 获取配置环境
config_name = os.environ.get('FLASK_ENV', 'development')

# 创建Flask应用
app = create_app(config_name)

if __name__ == '__main__':
    # 获取运行参数
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"启动Flask应用: {config_name}环境")
    logger.info(f"监听地址: http://{host}:{port}")
    logger.info(f"调试模式: {debug}")
    
    # 启动应用
    app.run(
        host=host,
        port=port,
        debug=debug
    )

