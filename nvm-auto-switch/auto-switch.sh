#!/bin/zsh

# 如果存在NVM，则加载它
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
  source "/usr/local/opt/nvm/nvm.sh"
fi

# 在当前目录或父目录中查找指定文件
find_up() {
  local path=$(pwd)
  while [[ "$path" != "" && ! -e "$path/$1" ]]; do
    path=${path%/*}
  done
  echo "$path"
}

# 自动检测并切换到.nvmrc文件中指定的Node.js版本
auto_switch_node_version() {
  # 检查nvm命令是否存在
  if ! command -v nvm &> /dev/null; then
    echo "未找到NVM。请先安装NVM: https://github.com/nvm-sh/nvm#installing-and-updating"
    return 1
  fi

  local NVMRC_PATH=$(find_up ".nvmrc")
  
  if [[ -n "$NVMRC_PATH" ]]; then
    local NVMRC_FILE="$NVMRC_PATH/.nvmrc"
    local NODE_VERSION=$(cat "$NVMRC_FILE")
    
    # 检查当前Node版本是否已经是目标版本
    if [[ "$(nvm current 2>/dev/null)" != "$NODE_VERSION" ]]; then
      echo "找到.nvmrc文件，指定版本: $NODE_VERSION"
      nvm use "$NODE_VERSION"
    fi
  fi
}

# 执行函数
auto_switch_node_version 