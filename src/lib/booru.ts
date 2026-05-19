import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import type { Post, Tag, Comment } from '@/types/post'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })

let booruHost = 'https://yande.re'
let booruUsername = ''
let booruPasswordHash = ''

export function setBooruConfig(config: { host?: string; username?: string; passwordHash?: string }) {
  if (config.host) booruHost = config.host
  if (config.username !== undefined) booruUsername = config.username
  if (config.passwordHash !== undefined) booruPasswordHash = config.passwordHash
}

function getParams() {
  return booruUsername ? { login: booruUsername, password_hash: booruPasswordHash } : {}
}

export async function searchPosts(tags: string, page = 1): Promise<Post[]> {
  const res = await axios.get(`${booruHost}/post.xml`, {
    params: { ...getParams(), tags, page, limit: 100 }
  })
  const data = parser.parse(res.data)
  const posts = data?.posts?.post
  if (!posts) return []
  return (Array.isArray(posts) ? posts : [posts]) as Post[]
}

export async function getPostDetail(id: number): Promise<Post | null> {
  const res = await axios.get(`${booruHost}/post.xml`, {
    params: { ...getParams(), tags: `id:${id}` }
  })
  const data = parser.parse(res.data)
  const post = data?.posts?.post
  return post ? (Array.isArray(post) ? post[0] : post) as Post : null
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await axios.get(`${booruHost}/comment.xml`, {
    params: { ...getParams(), post_id: postId }
  })
  const data = parser.parse(res.data)
  const comments = data?.comments?.comment
  if (!comments) return []
  return (Array.isArray(comments) ? comments : [comments]) as Comment[]
}

export async function searchTags(query: string): Promise<Tag[]> {
  const res = await axios.get(`${booruHost}/tag.xml`, {
    params: { ...getParams(), name: `*${query}*`, limit: 20, order: 'count' }
  })
  const data = parser.parse(res.data)
  const tags = data?.tags?.tag
  if (!tags) return []
  return (Array.isArray(tags) ? tags : [tags]).map(tag => ({
    ...tag,
    type: Number(tag.type)
  })) as Tag[]
}

export async function getPopularTags(page = 1, limit = 100): Promise<Tag[]> {
  const res = await axios.get(`${booruHost}/tag.xml`, {
    params: { ...getParams(), limit, page, order: 'count' }
  })
  const data = parser.parse(res.data)
  const tags = data?.tags?.tag
  if (!tags) return []
  return (Array.isArray(tags) ? tags : [tags]).map(tag => ({
    ...tag,
    type: Number(tag.type)
  })) as Tag[]
}

export async function favorite(postId: number): Promise<boolean> {
  try {
    await axios.post(`${booruHost}/favorite/create.json`, null, {
      params: { ...getParams(), id: postId }
    })
    return true
  } catch {
    return false
  }
}

export async function downloadImage(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url)
  const blob = await res.blob()
  return await blob.arrayBuffer()
}

async function hashPassword(password: string): Promise<string> {
  // SHA1 hash implementation using Web Crypto API
  const salt = 'choujin-steiner--your-password--'
  const text = salt.replace('your-password', password)
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function login(username: string, password: string): Promise<{ success: boolean; userId?: string }> {
  try {
    const passwordHash = await hashPassword(password)
    const res = await axios.get(`${booruHost}/user.xml`, {
      params: { login: username, password_hash: passwordHash }
    })
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
    const data = parser.parse(res.data)
    const user = data?.users?.user
    if (user) {
      booruUsername = username
      booruPasswordHash = passwordHash
      await window.api.settings.set('booruUsername', username)
      await window.api.settings.set('booruPasswordHash', passwordHash)
      await window.api.settings.set('booruUserId', String(user.id))
      return { success: true, userId: String(user.id) }
    }
    return { success: false }
  } catch {
    return { success: false }
  }
}

export function logout(): void {
  booruUsername = ''
  booruPasswordHash = ''
  window.api.settings.set('booruUsername', '')
  window.api.settings.set('booruPasswordHash', '')
  window.api.settings.set('booruUserId', '')
}
