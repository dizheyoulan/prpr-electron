export const IPC_CHANNELS = {
  // 图片下载
  DOWNLOAD_IMAGE: 'booru:download-image',
  OPEN_FILE_IN_FOLDER: 'booru:open-file-in-folder',
  // 壁纸
  SET_WALLPAPER: 'wallpaper:set',
  // 设置
  GET_SETTINGS: 'settings:get',
  SET_SETTINGS: 'settings:set',
  GET_ALL_SETTINGS: 'settings:get-all',
  SELECT_FOLDER: 'settings:select-folder'
} as const
