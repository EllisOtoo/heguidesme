"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HeroCardConfig = {
  src: string;
  alt: string;
  className: string;
  from: { x: number; y: number; rotate: number; scale: number };
  parallaxY: number;
};

const HERO_CARDS: HeroCardConfig[] = [
  {
    src: "/images/hero/placeholder-1.svg",
    alt: "Placeholder journal",
    className:
      "left-4 top-20 sm:left-10 sm:top-24 w-36 sm:w-40 md:w-52 lg:w-60",
    from: { x: -120, y: 24, rotate: -10, scale: 0.92 },
    parallaxY: -30,
  },
  {
    src: "/images/hero/placeholder-2.svg",
    alt: "Placeholder journal",
    className:
      "left-10 bottom-10 sm:left-16 sm:bottom-14 w-40 sm:w-48 md:w-60 lg:w-72",
    from: { x: -140, y: 40, rotate: 8, scale: 0.92 },
    parallaxY: 40,
  },
  {
    src: "/images/hero/placeholder-3.svg",
    alt: "Placeholder journal",
    className:
      "right-6 top-24 sm:right-12 sm:top-20 w-40 sm:w-48 md:w-60 lg:w-72",
    from: { x: 140, y: 18, rotate: 10, scale: 0.92 },
    parallaxY: -24,
  },
  {
    src: "/images/hero/placeholder-4.svg",
    alt: "Placeholder journal",
    className:
      "right-8 bottom-12 sm:right-14 sm:bottom-14 w-36 sm:w-44 md:w-56 lg:w-64",
    from: { x: 120, y: 44, rotate: -8, scale: 0.92 },
    parallaxY: 34,
  },
];

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      cards.forEach((card, index) => {
        const config = HERO_CARDS[index];
        if (!config) return;
        gsap.set(card, {
          autoAlpha: 0,
          x: config.from.x,
          y: config.from.y,
          rotate: config.from.rotate,
          scale: config.from.scale,
          transformOrigin: "50% 50%",
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(
        cards,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.0,
          stagger: 0.08,
        },
        0
      );

      gsap.to(cards, {
        y: (i) => HERO_CARDS[i]?.parallaxY ?? 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[64vh] overflow-hidden flex items-center justify-center text-center px-4 bg-gradient-to-b from-white to-background-mist/30"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,123,194,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(187,225,65,0.14),transparent_55%)]" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-text-dark mb-6 tracking-tight">
          Find Your Quiet Place
        </h1>
        <p className="text-lg md:text-xl text-text-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover our collection of journals and spiritual growth tools
          designed to help you pause, reflect, and connect.
        </p>
        <Link
          href="#products"
          className="inline-flex items-center justify-center bg-primary-blue text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
        >
          Shop Now
        </Link>
      </div>

      <div aria-hidden="true" className="absolute inset-0 z-0">
        {HERO_CARDS.map((card, index) => (
          <div
            key={card.src}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className={[
              "absolute opacity-0 will-change-transform",
              "rounded-2xl border border-white/60 bg-white/70 shadow-xl shadow-black/5 backdrop-blur-sm",
              "transition-transform duration-300 hover:-translate-y-1",
              card.className,
            ].join(" ")}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 10rem, (max-width: 1024px) 14rem, 18rem"
                className="object-cover"
                priority
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

