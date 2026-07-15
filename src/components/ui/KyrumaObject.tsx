export default function KyrumaObject() {
  return (
    <div className="relative flex h-[620px] w-[620px] items-center justify-center">

      {/* Glow */}

      <div className="absolute h-[620px] w-[620px] rounded-full bg-[#FF5A00]/6 blur-[140px]" />

      {/* Halo */}

      <div className="absolute h-[520px] w-[520px] rounded-full border border-black/5" />

      <div className="absolute h-[420px] w-[420px] rounded-full border border-black/5" />

      {/* Objeto */}

      <div
        className="
          relative
          h-[360px]
          w-[230px]
          rounded-[72px]
          border
          border-white/60
          bg-gradient-to-b
          from-white
          to-[#F1F1ED]
          shadow-[0_40px_120px_rgba(0,0,0,.08)]
        "
      >

        {/* Luz */}

        <div className="absolute inset-0 rounded-[72px] bg-gradient-to-br from-white/90 via-transparent to-transparent" />

        {/* Punto KYRUMA */}

        <div className="absolute bottom-14 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#FF5A00]" />

      </div>

    </div>
  );
}