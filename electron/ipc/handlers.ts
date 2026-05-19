import { ipcMain, dialog, shell } from 'electron'
import { IPC_CHANNELS } from './channels'
import { WallpaperService } from '../services/WallpaperService'
import { ImageDownloader } from '../services/ImageDownloader'
import { appStore } from '../utils/store'

export function registerHandlers(): void {
  // 下载图片
  ipcMain.handle(IPC_CHANNELS.DOWNLOAD_IMAGE, async (_, { buffer, filename }) => {
    return await ImageDownloader.save(Buffer.from(buffer), filename)
  })

  // 打开文件所在文件夹
  ipcMain.handle(IPC_CHANNELS.OPEN_FILE_IN_FOLDER, (_, filePath: string) => {
    shell.showItemInFolder(filePath)
  })

  // 壁纸 - 设置
  ipcMain.handle(IPC_CHANNELS.SET_WALLPAPER, async (_, { buffer, postId, cropMethod }) => {
    return await WallpaperService.setWallpaper(Buffer.from(buffer), postId, cropMethod)
  })

  // 设置 - 获取
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, (_, key: string) => {
    return appStore.get(key)
  })

  // 设置 - 保存
  ipcMain.handle(IPC_CHANNELS.SET_SETTINGS, (_, { key, value }) => {
    appStore.set(key, value)
  })

  // 设置 - 获取全部
  ipcMain.handle(IPC_CHANNELS.GET_ALL_SETTINGS, () => {
    return appStore.store
  })

  // 设置 - 选择文件夹
  ipcMain.handle(IPC_CHANNELS.SELECT_FOLDER, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })
}
