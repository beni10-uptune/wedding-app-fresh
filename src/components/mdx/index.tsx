import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { PlaylistEmbed } from '@/components/PlaylistEmbed'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Lazy load interactive components
const Quiz = dynamic(() => import('./Quiz'), { 
  loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />
})
const MusicCalculator = dynamic(() => import('./MusicCalculator'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />
})
const TrendingSongs = dynamic(() => import('./TrendingSongs'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />
})
const PlaylistShowcase = dynamic(() => import('./PlaylistShowcase'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />
})
const Checklist = dynamic(() => import('./Checklist'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />
})
const CalloutBox = dynamic(() => import('./CalloutBox'))
const InteractiveTimeline = dynamic(() => import('./InteractiveTimeline'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />
})

// CTA Components
const TrialCTA = () => (
  <div className="my-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
    <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
    <p className="text-gray-600 mb-4">
      Join thousands of couples planning their perfect wedding soundtrack
    </p>
    <Link href="/signup">
      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        Start Your Free Trial
      </Button>
    </Link>
  </div>
)

const FeatureCTA = ({ feature, text }: { feature: string; text: string }) => (
  <Link href={`/?feature=${feature}`} className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
    {text} →
  </Link>
)

// Enhanced markdown components
const components = {
  // Headers with anchor links
  h1: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h1 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h2 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h3 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h3>
    )
  },
  
  // Enhanced links
  a: ({ href, children, ...props }: any) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    
    if (isInternal) {
      return (
        <Link href={href} className="text-purple-600 hover:text-purple-700 underline" {...props}>
          {children}
        </Link>
      )
    }
    
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-purple-600 hover:text-purple-700 underline"
        {...props}
      >
        {children}
      </a>
    )
  },
  
  // Images with Next.js optimization
  img: ({ src, alt, ...props }: any) => {
    return (
      <span className="block my-8">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg"
          {...props}
        />
      </span>
    )
  },
  
  // Code blocks
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props}>
      {children}
    </pre>
  ),
  
  code: ({ className, children, ...props }: any) => {
    const isInline = !className
    return (
      <code 
        className={cn(
          isInline && 'bg-gray-100 px-1.5 py-0.5 rounded text-sm',
          className
        )} 
        {...props}
      >
        {children}
      </code>
    )
  },
  
  // Tables
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  ),
  
  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4" {...props}>
      {children}
    </ol>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 my-6 italic text-gray-700" {...props}>
      {children}
    </blockquote>
  ),
  
  // Interactive components
  Quiz,
  MusicCalculator,
  TrendingSongs,
  PlaylistShowcase,
  PlaylistEmbed,
  Checklist,
  CalloutBox,
  InteractiveTimeline,
  TrialCTA,
  FeatureCTA,
}

export const mdxComponents = components