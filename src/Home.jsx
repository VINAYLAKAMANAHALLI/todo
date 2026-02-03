import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.9 }, 
      { opacity: 1, scale: 1, duration: 1 }
    )
    .fromTo(titleRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8 }, 
      "-=0.6"
    )
    .fromTo(descRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8 }, 
      "-=0.6"
    )
    .fromTo(btnRef.current, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6 }, 
      "-=0.6"
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div ref={containerRef} className="max-w-4xl w-full text-center space-y-10 relative z-10 p-12 bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-gray-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <h1 ref={titleRef} className="text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          Todo App
        </h1>
        
        <p ref={descRef} className="text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
          Elevate your productivity. <br />
          Experience the <span className="text-blue-400 font-semibold">future</span> of task management.
        </p>

        <div ref={btnRef} className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
          <Link to="/login" className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:-translate-y-1 overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link to="/todos" className="group px-10 py-4 bg-gray-800/80 rounded-xl font-bold text-lg text-white border border-gray-700 transition-all duration-300 hover:bg-gray-700 hover:border-gray-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            My Todos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;