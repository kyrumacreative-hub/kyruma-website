export default function HeroVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">

      {/* Glow */}

      <div className="absolute h-[700px] w-[700px] rounded-full bg-[#FF5A00]/5 blur-[140px]" />

      {/* Shadow */}

      <div className="absolute h-[520px] w-[520px] rounded-full bg-black/5 blur-[80px]" />

      {/* Sculpture */}

      <div className="relative">

        <div
          className="
            h-[430px]
            w-[260px]
            rounded-[90px]
            border
            border-white/70
            bg-gradient-to-b
            from-white
            via-[#F6F6F2]
            to-[#ECECE8]
            shadow-[0_80px_120px_rgba(0,0,0,.12)]
        "
        >

          {/* Highlight */}

          <div className="absolute left-6 right-6 top-6 h-[120px] rounded-full bg-white/70 blur-2xl" />

          {/* Orange accent */}

          <div className="absolute bottom-10 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#FF5A00]" />

        </div>

      </div>

    </div>
  );
}