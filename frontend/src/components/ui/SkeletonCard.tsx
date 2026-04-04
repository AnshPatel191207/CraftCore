import { cn } from '../../lib/utils';


interface SkeletonCardProps {
  className?: string;
  rows?: number;
}


export function SkeletonCard({ className, rows = 3 }: SkeletonCardProps) {
  return (
    <div className={cn(
      'glass rounded-[24px] p-6 border border-white/5 relative overflow-hidden',
      className
    )}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer opacity-5 pointer-events-none" />

      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-surface-3 animate-pulse" />
        <div className="w-16 h-4 rounded-lg bg-surface-2 animate-pulse" />
      </div>

      {/* Text rows */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-surface-2 rounded-full animate-pulse"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}

        {/* Bottom value block */}
        <div className="h-8 w-1/2 bg-surface-3 rounded-xl animate-pulse mt-2" />
      </div>
    </div>
  );
}