import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock, Calendar, User, Share2, Bookmark, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBlogPost, getRelatedPosts, getBlogPosts } from '@/lib/blog/api'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { NewsletterSignup } from '@/components/blog/NewsletterSignup'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { mdxComponents } from '@/components/mdx'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: typeof post.publishedAt === 'string' 
        ? post.publishedAt 
        : post.publishedAt.toDate().toISOString(),
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `https://uptune.xyz/blog/${post.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts({ limit: 100 })
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.category,
    post.tags,
    3
  )

  const publishedDate = (typeof post.publishedAt === 'string' 
    ? new Date(post.publishedAt) 
    : post.publishedAt.toDate()
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <ReadingProgress />
      
      <article className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {publishedDate}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {post.excerpt}
          </p>

          {/* Author and Share */}
          <div className="flex items-center justify-between border-y py-4">
            <div className="flex items-center gap-3">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareButtons 
                url={`https://uptune.xyz/blog/${post.slug}`}
                title={post.title}
              />
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {post.featuredImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <MDXRemote 
                source={post.content}
                components={mdxComponents}
              />
            </div>

            {/* Post Footer */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-lg text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Plan Your Wedding Music?</h3>
                <p className="mb-6 text-purple-100">
                  Create the perfect playlist for every moment of your special day
                </p>
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    Start Your Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Table of Contents */}
            <TableOfContents content={post.content} />

            {/* Newsletter */}
            <NewsletterSignup />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <BlogPostCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  )
}