export default function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center h-full">

      {/* Ambient Light */}

      <div className="absolute h-[700px] w-[700px] rounded-full bg-[#FF5A00]/[0.03] blur-[180px]" />

      {/* Shadow */}

      <div className="absolute bottom-8 h-[420px] w-[420px] rounded-full bg-black/[0.05] blur-[90px]" />

      {/* Sculpture */}

      <div className="relative">

        {/* Back Layer */}

        <div
          className="
            absolute
            left-8
            top-8
            h-[420px]
            w-[260px]
            rounded-[90px]
            border
            border-black/[0.03]
            bg-white/40
            backdrop-blur-xl
          "
        />

        {/* Middle Layer */}

        <div
          className="
            absolute
            left-4
            top-4
            h-[420px]
            w-[260px]
            rounded-[90px]
            border
            border-black/[0.04]
            bg-white/70
            backdrop-blur-xl
          "
        />

        {/* Front Layer */}

        <div
          className="
            relative
            flex
            h-[420px]
            w-[260px]
            items-end
            justify-center
            overflow-hidden
            rounded-[90px]
            border
            border-white
            bg-gradient-to-b
            from-white
            via-[#F8F8F6]
            to-[#ECECE8]
            shadow-[0_60px_120px_rgba(0,0,0,.10)]
          "
        >
          {/* Top Highlight */}

          <div className="absolute top-6 left-8 right-8 h-24 rounded-full bg-white/80 blur-2xl" />

          {/* Vertical Reflection */}

          <div className="absolute left-6 top-0 h-full w-px bg-white/70" />

          {/* Accent */}

          <div className="mb-10 h-3 w-3 rounded-full bg-[#FF5A00]" />
        </div>
      </div>
    </div>
  );
}