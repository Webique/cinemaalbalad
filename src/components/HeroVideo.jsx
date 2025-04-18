import logo from "../assets/logo.png"; // Update path if necessary

export default function HeroVideo() {
  return (
    <div
      className="relative w-full mt-28 flex justify-center items-center"
      style={{
        height: "calc(100vh - 7rem)",
      }}
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center md:bg-[center_60%]"
        style={{
          backgroundImage: `url('/hero1.png')`,
        }}
      >
        {/* Override on desktop */}
        <div
          className="hidden md:block absolute inset-0 bg-no-repeat bg-cover bg-[center_60%]"
          style={{
            backgroundImage: `url('/desktop.png')`,
          }}
        ></div>
      </div>

      {/* Logo (desktop only) */}
      <img
        src={logo}
        alt="Cinema Al Balad"
        className="hidden md:block relative z-10 w-72 sm:w-96 md:w-[500px] animate-fadeIn drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}
