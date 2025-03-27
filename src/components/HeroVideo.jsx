import banner from "../assets/banner.mp4";

export default function HeroVideo() {
  return (
    <div className="w-full mt-28 bg-black flex justify-center items-center">
      <video
        className="w-full max-h-[calc(100vh-7rem)] aspect-video object-contain"
        src={banner}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
