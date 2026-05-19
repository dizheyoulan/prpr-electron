import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'

const api = {
  // 窗口控制
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close')
  },
  // 图片下载
  downloadImage: (buffer: ArrayBuffer, filename: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.DOWNLOAD_IMAGE, { buffer, filename }),
  openFileInFolder: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_FILE_IN_FOLDER, filePath),
  // 壁纸
  wallpaper: {
    set: (buffer: ArrayBuffer, postId: number, cropMethod: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.SET_WALLPAPER, { buffer, postId, cropMethod })
  },
  // 设置
  settings: {
    get: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS, key),
    set: (key: string, value: unknown) =>
      ipcRenderer.invoke(IPC_CHANNELS.SET_SETTINGS, { key, value }),
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_SETTINGS),
    selectFolder: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_FOLDER)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
