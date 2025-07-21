export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-white/10 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded"></div>
        <div className="h-3 bg-white/10 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function PlaylistSkeleton() {
  return (
    <div className="glass-darker rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-white/10 rounded w-1/3"></div>
            <div className="h-4 bg-white/10 rounded w-24"></div>
          </div>
          <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
          <div className="w-full bg-white/5 rounded-full h-3"></div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-white/10 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-8 bg-white/10 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="glass-gradient rounded-3xl p-8 md:p-12 animate-pulse">
        <div className="h-10 bg-white/10 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-darker rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded w-12"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Playlists skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/4 animate-pulse"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <PlaylistSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}