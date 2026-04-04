export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-leaf-500/10 rounded-full border border-leaf-500/20 shadow-sm transition-all hover:bg-leaf-500/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-600"></span>
      </span>
      <span className="text-[10px] font-bold text-leaf-700 tracking-widest uppercase">LIVE</span>
      <span className="text-[10px] text-leaf-600/70 font-medium">Monitoring Fields</span>
    </div>
  );
}
