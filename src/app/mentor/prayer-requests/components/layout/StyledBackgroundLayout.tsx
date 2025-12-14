import Image from 'next/image';

export default function StyledBackgroundLayout() {
  return (
 <div className="absolute inset-0 flex items-center justify-center">
  <Image
    src="/pray3.jpg"
    alt="Background"
    fill
    className="w-full h-full object-cover object-center"
    priority
  />
  <div className="absolute inset-0 bg-black/30" />
  
  {/* Grid Overlay */}
  <div className="absolute inset-0 opacity-10" 
    style={{
       backgroundImage: `
        linear-gradient(rgba(128, 0, 128, 0.4) 1px,  1px),
        linear-gradient(90deg, rgba(255, 105, 180, 0.4) 1px,  1px)
      `,
      backgroundSize: "20px 20px",
      backgroundColor: "rgba(0, 0, 0, 0)", 
    }}
  ></div>

  {/* Decorative Elements (optional) */}
  <div className="absolute top-10 right-10 w-12 h-12   bg-linear-to-r from-purple-600 to-pink-600 rounded-full opacity-60 animate-pulse"></div>
  <div className="absolute bottom-10 left-10 w-20 h-1   bg-linear-to-r from-purple-600 to-pink-600 rotate-45"></div>
</div>

  );
}
