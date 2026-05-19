import { app, BrowserWindow, shell, ipcMain, session, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerHandlers } from './ipc/handlers'
import { initDb } from './database'
import { appStore } from './utils/store'
import { setupAxiosProxy, getSystemProxy } from './utils/proxy'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; //关闭安全警告
export let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function createTray(): void {
  // 托盘图标：使用相对于编译后文件的路径，这样在开发和打包后都能正确找到
  const iconPath = join(__dirname, '../../assets/poster.ico')

  let trayIcon = nativeImage.createFromPath(iconPath)

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主界面',
      click: () => {
        mainWindow?.show()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('PRPR')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
    }
  })
}

function createWindow(): void {
  const iconPath = join(__dirname, '../../assets/poster.ico')

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1a1a2e',
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
    return false
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 仅在开发环境打开开发者工具
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.prpr.app')

  // 配置系统代理：主进程 axios 走代理
  setupAxiosProxy()
  // 配置渲染进程（Chromium）走同一代理
  const proxyUrl = getSystemProxy()
  if (proxyUrl) {
    await session.defaultSession.setProxy({ proxyRules: proxyUrl })
    console.log('[Proxy] 渲染进程代理已配置:', proxyUrl)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('window:minimize', () => mainWindow?.minimize())
  ipcMain.on('window:maximize', () => {
    mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize()
  })
  ipcMain.on('window:close', () => mainWindow?.close())

  await initDb()
  registerHandlers()

  // 移除对 yande.re 图片请求的 Referer，防止 CDN 拒绝
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://*.yande.re/*', 'https://*.konachan.com/*'] },
    (details, callback) => {
      delete details.requestHeaders['Referer']
      callback({ requestHeaders: details.requestHeaders })
    }
  )

  createTray()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit() // 注释掉，由托盘控制退出
  }
})
