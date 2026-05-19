import { execSync } from 'child_process'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

/** 读取系统代理地址，返回如 "http://127.0.0.1:7890" 或 undefined */
export function getSystemProxy(): string | undefined {
  // 1. 环境变量优先
  const fromEnv =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy

  if (fromEnv) return fromEnv

  // 2. Windows 注册表
  if (process.platform === 'win32') {
    try {
      const enabled = execSync(
        'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable',
        { encoding: 'utf-8' }
      )
      if (!enabled.includes('0x1')) return undefined

      const server = execSync(
        'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer',
        { encoding: 'utf-8' }
      )
      const match = server.match(/ProxyServer\s+REG_SZ\s+(.+)/)
      if (match?.[1]) {
        const addr = match[1].trim()
        return addr.startsWith('http') ? addr : `http://${addr}`
      }
    } catch {
      // 读取失败则忽略
    }
  }

  return undefined
}

/** 为 axios 全局默认实例配置系统代理（主进程调用） */
export function setupAxiosProxy(): void {
  const proxyUrl = getSystemProxy()
  if (!proxyUrl) {
    console.log('[Proxy] 未检测到系统代理')
    return
  }
  try {
    const agent = new HttpsProxyAgent(proxyUrl)
    axios.defaults.httpAgent = agent
    axios.defaults.httpsAgent = agent
    axios.defaults.proxy = false
    console.log('[Proxy] Axios 已配置系统代理:', proxyUrl)
  } catch (err) {
    console.error('[Proxy] 配置代理失败:', err)
  }
}
