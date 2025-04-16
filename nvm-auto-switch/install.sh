#!/bin/zsh

# 修复BASH_SOURCE在zsh中的问题
# 获取当前脚本所在目录
if [[ -n "${BASH_SOURCE[0]}" ]]; then
  # bash环境
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
  # zsh环境
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi

echo "脚本目录: $SCRIPT_DIR"

# 确保auto-switch.sh文件存在
if [ ! -f "$SCRIPT_DIR/auto-switch.sh" ]; then
  echo "错误: $SCRIPT_DIR/auto-switch.sh 文件不存在"
  exit 1
fi

# 设置执行权限
chmod +x "$SCRIPT_DIR/auto-switch.sh"

# 创建存放目录
mkdir -p ~/.nvm-auto-switch

# 复制脚本文件
cp "$SCRIPT_DIR/auto-switch.sh" ~/.nvm-auto-switch/

# 检查是否已经配置过
if ! grep -q "source ~/.nvm-auto-switch/auto-switch.sh" ~/.zshrc; then
    echo '' >> ~/.zshrc
    echo '# 基于.nvmrc自动切换Node.js版本' >> ~/.zshrc
    echo 'source ~/.nvm-auto-switch/auto-switch.sh' >> ~/.zshrc
    echo "已将自动切换脚本添加到~/.zshrc中"
else
    echo "自动切换脚本已在~/.zshrc中配置"
fi

echo "安装完成。请重启终端或执行:"
echo "source ~/.zshrc" 