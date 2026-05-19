export interface FaceRect {
  x: number
  y: number
  width: number
  height: number
}

export interface DetectResult {
  faces: FaceRect[]
  imageWidth: number
  imageHeight: number
}

/**
 * 人脸检测服务（简化版）
 * 原 UWP 使用 OpenCV C++ AnimeFaceDetector
 * 此版本使用启发式规则（动漫图片人脸通常在上方 1/3 区域）
 * 可后续接入 face-api.js (TensorFlow.js) 实现真正的人脸检测
 */
export class FaceDetector {
  static async detectFromUrl(imageUrl: string): Promise<DetectResult> {
    // 通过图片 URL 获取尺寸信息（从 Post 数据中已知，此处做简化处理）
    return { faces: [{ x: 0.25, y: 0.05, width: 0.5, height: 0.4 } as any], imageWidth: 0, imageHeight: 0 }
  }

  /**
   * 根据人脸位置计算裁剪区域
   * @param imgWidth 图片宽度
   * @param imgHeight 图片高度
   * @param targetWidth 目标宽度
   * @param targetHeight 目标高度
   * @returns 裁剪参数 { x, y, width, height }（归一化 0-1）
   */
  static getCropRegion(
    imgWidth: number,
    imgHeight: number,
    targetWidth: number,
    targetHeight: number
  ): { x: number; y: number; w: number; h: number } {
    const targetRatio = targetWidth / targetHeight
    const imgRatio = imgWidth / imgHeight

    if (imgRatio > targetRatio) {
      // 图片更宽，裁剪左右
      const cropW = imgHeight * targetRatio
      const x = (imgWidth - cropW) / 2
      return { x: x / imgWidth, y: 0, w: cropW / imgWidth, h: 1 }
    } else {
      // 图片更高，裁剪上下（人脸居上）
      const cropH = imgWidth / targetRatio
      const faceTop = imgHeight * 0.1 // 人脸从 10% 处开始
      const y = Math.min(faceTop, imgHeight - cropH)
      return { x: 0, y: Math.max(0, y) / imgHeight, w: 1, h: cropH / imgHeight }
    }
  }
}

