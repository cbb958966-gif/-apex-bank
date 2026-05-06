export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center items-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3zM12 8v8M8 12h8" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Apex Bank</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
              Banking that works<br />as hard as you do
            </h1>
            <p className="text-lg text-white/60 max-w-md">
              Experience the future of finance with intelligent insights, seamless transfers, and powerful analytics.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-3xl font-bold mb-1">$2.4B+</p>
              <p className="text-sm text-white/50">Assets Managed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-3xl font-bold mb-1">500K+</p>
              <p className="text-sm text-white/50">Active Users</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-3xl font-bold mb-1">99.99%</p>
              <p className="text-sm text-white/50">Uptime</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-3xl font-bold mb-1">256-bit</p>
              <p className="text-sm text-white/50">Encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
