import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

export interface MDXFrontmatter {
  title: string
  excerpt: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  featuredImage?: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
  }
}

export async function parseMDXFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  
  const processedContent = await remark()
    .use(remarkGfm)
    .process(content)
  
  const frontmatter = data as MDXFrontmatter
  const stats = readingTime(content)
  
  return {
    frontmatter,
    content: processedContent.toString(),
    readTime: Math.ceil(stats.minutes),
    slug: path.basename(filePath, '.mdx'),
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function extractExcerpt(content: string, length: number = 160): string {
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  
  if (plainText.length <= length) return plainText
  return plainText.substring(0, length).trim() + '...'
}