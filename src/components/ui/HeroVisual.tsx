export default function HeroVisual() {
  return (
    <div className="relative flex h-[620px] items-center justify-center">
      {/* Ambient light */}

      <div className="absolute h-[700px] w-[700px] rounded-full bg-[#FF5A00]/[0.05] blur-[180px]" />

      {/* Large card */}

      <div className="relative h-[520px] w-[420px] overflow-hidden rounded-[42px] border border-black/5 bg-white shadow-[0_40px_120px_rgba(0,0,0,.08)]">
        {/* Editorial image */}

        <img
          src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

        {/* Brand label */}

        <div className="absolute left-8 top-8 rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
          KYRUMA
        </div>

        {/* Bottom content */}

        <div className="absolute bottom-8 left-8 right-8">
          <div className="text-xs uppercase tracking-[0.25em] text-white/70">
            Featured Project
          </div>

          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            Building brands people trust.
          </h3>
        </div>
      </div>

      {/* Floating card */}

      <div className="absolute -bottom-6 -left-8 rounded-3xl border border-black/5 bg-white px-8 py-6 shadow-[0_25px_60px_rgba(0,0,0,.08)]">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">
          Focus
        </div>

        <div className="mt-2 text-xl font-semibold tracking-[-0.04em]">
          Strategy · Identity · Digital
        </div>
      </div>
    </div>
  );
}