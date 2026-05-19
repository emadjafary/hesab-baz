export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      {/* hero */}
      <div className="h-32 rounded-2xl bg-slate-800/60" />
      {/* quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-[14px] bg-slate-800/60" />
            <div className="h-2.5 w-12 rounded-full bg-slate-800/40" />
          </div>
        ))}
      </div>
      {/* composition */}
      <div className="h-20 rounded-xl bg-slate-800/60" />
      {/* top holdings */}
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-[14px] bg-slate-800/60" />
        ))}
      </div>
    </div>
  )
}
