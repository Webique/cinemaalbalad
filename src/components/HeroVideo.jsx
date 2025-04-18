import logo from "../assets/logo.png"; // Update path if necessary

export default function HeroVideo() {
  return (
    <div
      className="relative w-full mt-28 flex justify-center items-center"
      style={{
        backgroundImage: "url('/hero1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center", // default for small screens
        height: "calc(100vh - 7rem)",
      }}
    >
      <div className="absolute inset-0 md:bg-[center_60%] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url('/hero1.png')" }}></div>

    <img
      src={logo}
      alt="Cinema Al Balad"
      className="hidden md:block relative z-10 w-72 sm:w-96 md:w-[500px] animate-fadeIn drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
    />

    </div>
  );
}
