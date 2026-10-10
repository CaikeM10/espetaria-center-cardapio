import Image from "next/image";

export function SplashScreen() {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        bg-[#070707]
      "
    >
      {/* brilho vermelho superior */}
      <div
        className="
          absolute
          -top-40
          -left-32
          w-[420px]
          h-[420px]
          rounded-full
          bg-red-700/30
          blur-[110px]
        "
      />

      {/* brilho inferior */}
      <div
        className="
          absolute
          -bottom-40
          -right-32
          w-[420px]
          h-[420px]
          rounded-full
          bg-orange-600/20
          blur-[120px]
        "
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-8 text-sm uppercase tracking-[0.32em] text-white/60">
          Seja bem-vindo
        </p>

        <Image
          src="/logoinicialcenter.png"
          alt="Espetaria Center"
          width={360}
          height={220}
          priority
          className="w-[280px] sm:w-[340px] h-auto"
        />

        <div className="mt-8 h-px w-16 bg-red-600" />

        <p className="mt-5 text-sm tracking-[0.2em] text-white/60">
          CARDÁPIO DIGITAL
        </p>
      </div>
    </section>
  );
}
