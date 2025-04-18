export default function HeroVideo() {
  return (
    <div
      className="relative w-full mt-28 flex justify-center items-center"
      style={{
        height: "calc(100vh - 7rem)",
      }}
    >
      {/* Background layer for mobile */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url('/hero1.png')`,
        }}
      >
        {/* Override on desktop */}
        <div
          className="hidden md:block absolute inset-0 bg-no-repeat bg-contain bg-center"
          style={{
            backgroundImage: `url('/desktop.png')`,
          }}
        ></div>
      </div>
    </div>
  );
}
