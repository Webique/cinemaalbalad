import logo from "../assets/logo.png"; // Update path if necessary

export default function HeroVideo() {
  return (
    <div
      className="relative w-full mt-28 flex justify-center items-center"
      style={{
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "calc(100vh - 7rem)",
      }}
    >
      <img
        src={logo}
        alt="Cinema Al Balad"
        className="w-72 sm:w-96 md:w-[500px] animate-fadeIn drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}
