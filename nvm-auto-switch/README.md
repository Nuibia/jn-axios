# NVM 自动切换

这个脚本能根据项目中的 `.nvmrc` 文件自动切换到指定的 Node.js 版本，每次打开终端时都会自动执行。

## 安装步骤

1. 确保已安装 NVM (Node Version Manager)。如果尚未安装，请使用以下命令安装：
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

2. 运行安装脚本：
   ```bash
   chmod +x nvm-auto-switch/install.sh
   ./nvm-auto-switch/install.sh
   ```
   这将自动将脚本安装到你的系统中。

3. 安装完成后，重启终端或执行：
   ```bash
   source ~/.zshrc
   ```

## 工作原理

- 脚本会自动在当前目录或其任意父目录中查找 `.nvmrc` 文件
- 一旦找到，会读取文件内容并切换到指定的 Node.js 版本
- 整个过程自动完成，无需手动介入

## 手动设置（可选）

如果你想手动设置而不使用安装脚本：

1. 给脚本添加执行权限：
   ```bash
   chmod +x nvm-auto-switch/auto-switch.sh
   ```

2. 将脚本复制到个人目录：
   ```bash
   mkdir -p ~/.nvm-auto-switch
   cp nvm-auto-switch/auto-switch.sh ~/.nvm-auto-switch/
   ```

3. 在 `~/.zshrc` 中添加以下行：
   ```bash
   source ~/.nvm-auto-switch/auto-switch.sh
   ```

4. 重载配置：
   ```bash
   source ~/.zshrc
   ```

现在，每当你打开新终端进入带有 `.nvmrc` 文件的项目目录时，系统会自动切换到指定的 Node.js 版本。 