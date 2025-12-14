"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";

export default function Hero() {
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text elements
      gsap.from(".hero-text", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2, // Small delay to ensuring rendering
      });

      // Animate images - slide in from outside viewport
      
      // Top Left: from left/top outside
      gsap.from(".hero-image-tl", { 
        x: -200, 
        y: -100, 
        opacity: 0, 
        duration: 2, 
        ease: "power4.out",
        delay: 0.2
      });

      // Top Right: from right/top outside
      gsap.from(".hero-image-tr", { 
        x: 200, 
        y: -100, 
        opacity: 0, 
        duration: 2, 
        ease: "power4.out",
        delay: 0.3
      });

      // Bottom Left: from bottom/left outside
      gsap.from(".hero-image-bl", { 
        x: -200, 
        y: 200, 
        opacity: 0, 
        duration: 2, 
        ease: "power4.out",
        delay: 0.4
      });

      // Bottom Right: from bottom/right outside
      gsap.from(".hero-image-br", { 
        x: 200, 
        y: 200, 
        opacity: 0, 
        duration: 2, 
        ease: "power4.out",
        delay: 0.5
      });

    }, comp);

    return () => ctx.revert();
  }, []);

  // Placeholder images using a reliable placeholder service or colored divs if preference
  // Using styled divs/images to represent a "modern" layout as sketched
  // The sketches show images surrounding the text.

  return (
    <section
      ref={comp}
      className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white to-background-mist/30 overflow-hidden"
    >
      {/* Decorative Floating Images (Book Shapes) */}
      {/* Top Left */}
      <div className="hero-image-tl absolute top-[10%] left-[5%] md:left-[10%] w-32 h-44 md:w-48 md:h-64 bg-white rounded-r-md rounded-l-sm shadow-2xl rotate-[-6deg] overflow-hidden z-0 border-l-4 border-gray-200">
         <Image src="https://picsum.photos/seed/quiet1/400/600" alt="Book 1" fill className="object-cover" />
      </div>

      {/* Top Right */}
      <div className="hero-image-tr absolute top-[15%] right-[5%] md:right-[10%] w-32 h-44 md:w-48 md:h-64 bg-white rounded-l-md rounded-r-sm shadow-2xl rotate-[12deg] overflow-hidden z-0 border-r-4 border-gray-200">
        <Image src="https://picsum.photos/seed/quiet2/400/600" alt="Book 2" fill className="object-cover" />
      </div>

      {/* Bottom Left */}
      <div className="hero-image-bl absolute bottom-[15%] left-[8%] md:left-[15%] w-32 h-44 md:w-48 md:h-64 bg-white rounded-r-md rounded-l-sm shadow-2xl rotate-[6deg] overflow-hidden z-0 hidden md:block border-l-4 border-gray-200">
        <Image src="https://picsum.photos/seed/quiet3/400/600" alt="Book 3" fill className="object-cover" />
      </div>

      {/* Bottom Right */}
      <div className="hero-image-br absolute bottom-[10%] right-[8%] md:right-[15%] w-32 h-44 md:w-48 md:h-64 bg-white rounded-l-md rounded-r-sm shadow-2xl rotate-[-8deg] overflow-hidden z-0 hidden md:block border-r-4 border-gray-200">
        <Image src="https://picsum.photos/seed/quiet4/400/600" alt="Book 4" fill className="object-cover" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="hero-text font-serif text-5xl md:text-7xl font-bold text-text-dark mb-6 tracking-tight">
          Find Your Quiet Place
        </h1>
        <p className="hero-text text-lg md:text-2xl text-text-light max-w-2xl mb-10 leading-relaxed font-light">
          Discover our collection of journals and spiritual growth tools
          designed to help you pause, reflect, and connect.
        </p>
        <div className="hero-text">
            <Link
            href="#products"
            className="bg-primary-blue text-white px-10 py-5 rounded-full font-medium text-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
            >
            Shop Now
            </Link>
        </div>
      </div>
    </section>
  );
}
