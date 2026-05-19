export interface Post {
  id: number
  tags: string
  created_at: number
  updated_at: number
  creator_id: number
  author: string
  source: string
  score: number
  md5: string
  file_size: number
  file_ext: string
  file_url: string
  preview_url: string
  preview_width: number
  preview_height: number
  sample_url: string
  sample_width: number
  sample_height: number
  sample_file_size: number
  jpeg_url: string
  jpeg_width: number
  jpeg_height: number
  rating: 's' | 'q' | 'e'
  width: number
  height: number
  has_children: boolean
  parent_id: number | null
  status: string
  is_pending: boolean
}

export interface Tag {
  id: number
  name: string
  count: number
  type: TagType
  ambiguous: boolean
}

export type TagType = 0 | 1 | 3 | 4 | 5 | 6
// 0: general, 1: artist, 3: copyright, 4: character, 5: circle, 6: faults

export const TAG_TYPE_LABELS: Record<TagType, string> = {
  0: '通用',
  1: '画师',
  3: '版权',
  4: '角色',
  5: '社团',
  6: '缺陷'
}

export const TAG_TYPE_COLORS: Record<TagType, string> = {
  0: '#b4c7d9',
  1: '#f5a623',
  3: '#a0c878',
  4: '#f78fb3',
  5: '#7ec8e3',
  6: '#e57373'
}

export interface Comment {
  id: number
  post_id: number
  creator: string
  creator_id: number
  body: string
  created_at: number
}

