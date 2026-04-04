import { cn } from '../../lib/utils';

interface SkeletonCardProps {
  className?: string;
  rows?: number;
}

export function SkeletonCard({ className, rows = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-6 border border-earth-100", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-earth-200/50 animate-pulse" />
        <div className="w-12 h-4 rounded bg-earth-100 animate-pulse" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-earth-100 rounded animate-pulse w-full"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
