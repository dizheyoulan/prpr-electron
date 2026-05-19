# PRPR - 动漫壁纸桌面客户端

<div align="center">

一个基于 Electron 的动漫壁纸桌面应用，支持浏览、下载和设置来自 Moebooru 图站的动漫壁纸，多图站功能正在开发中（目前支持yandere）。

</div>

## ✨ 功能特性

- 🔍 **智能搜索** - 支持标签搜索、评分筛选、尺寸过滤
- 💾 **本地管理** - 壁纸下载、收藏管理、本地数据库存储
- 🎨 **一键设置** - 快速将喜欢的壁纸设置为桌面背景
- 🔄 **自动更新** - 支持定时自动更换壁纸

## 🛠️ 技术栈

- **框架**: Electron 42 + Vue 3.5
- **UI 组件**: Element Plus 2.9
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: SQL.js
- **构建工具**: Vite + Electron Vite
- **语言**: TypeScript

## 📦 安装使用

### 下载安装包

前往 [Releases](../../releases) 页面下载最新版本的安装包：

- Windows: `prpr-electron-x.x.x-x64.nsis.7z`

解压后运行安装程序即可。

- **网络说明**：由于 yandere 是国外图站，在国内使用时需要开启 VPN 代理才能正常访问。

### 从源码构建

**环境要求**
- Node.js 20+

**安装依赖**
```bash
npm install
# 或
pnpm install
```

**开发模式**
```bash
npm run electron:dev
```

**构建应用**
```bash
# 构建安装包
npm run electron:build

# 构建便携版
npm run electron:build:portable
```

## 📝 注意事项

- 本项目仅供学习交流使用
- 请遵守图站的使用条款和版权规定
- 下载的图片仅供个人使用，请勿用于商业用途

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

<div align="center">
Made with ❤️ by PRPR Team
</div>
