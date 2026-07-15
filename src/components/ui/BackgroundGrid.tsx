export default function BackgroundGrid() {
  return (
    <>
      {/* Halo principal */}

      <div className="absolute left-1/2 top-1/2 -z-20 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A00]/4 blur-[180px]" />

      {/* Luz superior */}

      <div className="absolute inset-x-0 top-0 -z-20 h-64 bg-gradient-to-b from-white to-transparent" />

      {/* Luz inferior */}

      <div className="absolute inset-x-0 bottom-0 -z-20 h-64 bg-gradient-to-t from-white to-transparent" />

    </>
  );
}