import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles } from 'lucide-react'

// Dynamic imports for interactive components
const Quiz = dynamic(() => import('./Quiz'), {
  loading: () => <div className="animate-pulse bg-white/10 h-64 rounded-xl" />
})
const MusicCalculator = dynamic(() => import('./MusicCalculator'), {
  loading: () => <div className="animate-pulse bg-white/10 h-64 rounded-xl" />
})
const TrendingSongs = dynamic(() => import('./TrendingSongs'), {
  loading: () => <div className="animate-pulse bg-white/10 h-96 rounded-xl" />
})
const PlaylistShowcase = dynamic(() => import('./PlaylistShowcase'), {
  loading: () => <div className="animate-pulse bg-white/10 h-64 rounded-xl" />
})
const Checklist = dynamic(() => import('./Checklist'), {
  loading: () => <div className="animate-pulse bg-white/10 h-64 rounded-xl" />
})
const CalloutBox = dynamic(() => import('./CalloutBox'))
const InteractiveTimeline = dynamic(() => import('./InteractiveTimeline'), {
  loading: () => <div className="animate-pulse bg-white/10 h-96 rounded-xl" />
})
const CTAButton = dynamic(() => import('./CTAButton'))
const SamplePlaylist = dynamic(() => import('./SamplePlaylist'), {
  loading: () => <div className="animate-pulse bg-white/10 h-96 rounded-xl" />
})

// CTA Components
const TrialCTA = () => (
  <div className="my-8 p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl text-center border border-purple-500/30">
    <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
    <h3 className="text-xl font-bold mb-2 text-white">Ready to Get Started?</h3>
    <p className="text-white/70 mb-4">
      Join thousands of couples planning their perfect wedding soundtrack
    </p>
    <Link href="/auth/signup">
      <Button size="lg" className="btn-primary">
        Start Your Free Trial
      </Button>
    </Link>
  </div>
)

const FeatureCTA = ({ feature, text }: { feature: string; text: string }) => (
  <Link href={`/?feature=${feature}`} className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors">
    {text} <span className="ml-1">→</span>
  </Link>
)

// Enhanced markdown components
const components = {
  // Headers with anchor links
  h1: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h1 id={id} className="scroll-mt-20 text-white" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h2 id={id} className="scroll-mt-20 text-white" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
      <h3 id={id} className="scroll-mt-20 text-white" {...props}>
        {children}
      </h3>
    )
  },
  
  // Enhanced links
  a: ({ href, children, ...props }: any) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    
    if (isInternal) {
      return (
        <Link href={href} className="text-purple-400 hover:text-purple-300 underline transition-colors" {...props}>
          {children}
        </Link>
      )
    }
    
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-purple-400 hover:text-purple-300 underline transition-colors"
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
    <pre className="bg-black/50 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-white/10" {...props}>
      {children}
    </pre>
  ),
  
  code: ({ className, children, ...props }: any) => {
    const isInline = !className
    return (
      <code 
        className={isInline ? "bg-white/10 text-purple-300 px-1 py-0.5 rounded text-sm" : className}
        {...props}
      >
        {children}
      </code>
    )
  },
  
  // Tables
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-white/20" {...props}>
        {children}
      </table>
    </div>
  ),
  
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70" {...props}>
      {children}
    </td>
  ),
  
  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-white/80" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-white/80" {...props}>
      {children}
    </ol>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-purple-500 pl-4 my-6 italic text-white/70" {...props}>
      {children}
    </blockquote>
  ),
  
  // Paragraphs
  p: ({ children, ...props }: any) => (
    <p className="text-white/80 my-4" {...props}>
      {children}
    </p>
  ),
  
  // Strong text
  strong: ({ children, ...props }: any) => (
    <strong className="text-white font-bold" {...props}>
      {children}
    </strong>
  ),
  
  // Interactive components
  Quiz,
  MusicCalculator,
  TrendingSongs,
  PlaylistShowcase,
  PlaylistEmbed: PlaylistShowcase,
  Checklist,
  CalloutBox,
  InteractiveTimeline,
  TrialCTA,
  FeatureCTA,
  CTAButton,
  SamplePlaylist,
}

export const mdxComponents = components