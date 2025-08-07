"use client"
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import MilestonesSection from './milestones';

const ScrollAnimation = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenisRef.current = lenis;
    
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const smoothStep = (p) => p * p * (3 - 2 * p);

    // Hero cards animation for desktop
    if (window.innerWidth > 1000) {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "75% top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const heroCardsContainerOpacity = gsap.utils.interpolate(
            1,
            0.5,
            smoothStep(progress)
          );
          gsap.set(".hero-cards", {
            opacity: heroCardsContainerOpacity,
          });

          ["#hero-card-1", "#hero-card-2", "#hero-card-3", "#hero-card-4"].forEach(
            (cardId, index) => {
              const delay = index * 0.9;
              const cardProgress = gsap.utils.clamp(
                0,
                1,
                (progress - delay * 0.1) / (1 - delay * 0.1)
              );

              const y = gsap.utils.interpolate(
                "0%",
                "350%",
                smoothStep(cardProgress)
              );
              const scale = gsap.utils.interpolate(
                1,
                0.75,
                smoothStep(cardProgress)
              );

              let x = "0%";
              let rotation = 0;
              if (index === 0) {
                x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
                rotation = gsap.utils.interpolate(
                  0,
                  -15,
                  smoothStep(cardProgress)
                );
              } else if (index === 1) {
                x = gsap.utils.interpolate("0%", "30%", smoothStep(cardProgress));
                rotation = gsap.utils.interpolate(
                  0,
                  -5,
                  smoothStep(cardProgress)
                );
              } else if (index === 2) {
                x = gsap.utils.interpolate("0%", "-30%", smoothStep(cardProgress));
                rotation = gsap.utils.interpolate(
                  0,
                  5,
                  smoothStep(cardProgress)
                );
              } else if (index === 3) {
                x = gsap.utils.interpolate(
                  "0%",
                  "-90%",
                  smoothStep(cardProgress)
                );
                rotation = gsap.utils.interpolate(
                  0,
                  15,
                  smoothStep(cardProgress)
                );
              }

              gsap.set(cardId, {
                y: y,
                x: x,
                rotation: rotation,
                scale: scale,
              });
            }
          );
        },
      });
    } else {
      // Hero cards fade out animation for mobile and tablets
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "center top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const heroCardsOpacity = gsap.utils.interpolate(
            1,
            0,
            smoothStep(progress)
          );
          
          const heroCardsY = gsap.utils.interpolate(
            "0%",
            "-30%",
            smoothStep(progress)
          );

          gsap.set(".hero-cards", {
            opacity: heroCardsOpacity,
            y: heroCardsY,
          });
        },
      });

      // Staggered mobile flip cards animation
      const mobileCards = document.querySelectorAll('.mobile-cards .card');
      mobileCards.forEach((card, idx) => {
        gsap.set(card, { opacity: 0, y: 50 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%', // triggers when card is near bottom of viewport
          end: 'top 60%',   // fully visible a bit higher
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(card, {
              opacity: progress,
              y: 50 * (1 - progress),
              overwrite: 'auto',
              duration: 0.1
            });
          },
        });
      });
    }

    // Services section animations (desktop only)
    if (window.innerWidth > 1000) {
      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: ".services",
        pinSpacing: true,
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        onLeave: () => {
          const servicesSection = document.querySelector(".services");
          const servicesRect = servicesSection.getBoundingClientRect();
          const servicesTop = window.pageYOffset + servicesRect.top;

          gsap.set(".cards", {
            position: "absolute",
            top: servicesTop,
            left: 0,
            width: "100%",
            height: "100svh",
          });
        },
        onEnterBack: () => {
          gsap.set(".cards", {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100svh",
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top bottom",
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
          const headerY = gsap.utils.interpolate(
            "400%",
            "0%",
            smoothStep(headerProgress)
          );
          gsap.set(".services-header", {
            y: headerY,
          });

          ["#card-1", "#card-2", "#card-3", "#card-4"].forEach((cardId, index) => {
            const delay = index * 0.3;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (0.9 - delay * 0.1)
            );

            const innerCard = document.querySelector(
              `${cardId} .flip-card-inner`
            );

            let y;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              y = gsap.utils.interpolate(
                "-100%",
                "50%",
                smoothStep(normalizedProgress)
              );
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              y = gsap.utils.interpolate(
                "50%",
                "0%",
                smoothStep(normalizedProgress)
              );
            } else {
              y = "0%";
            }

            let scale;
            if (cardProgress < 0.4) {
              const normalizedProgress = cardProgress / 0.4;
              scale = gsap.utils.interpolate(
                0.25,
                0.75,
                smoothStep(normalizedProgress)
              );
            } else if (cardProgress < 0.6) {
              const normalizedProgress = (cardProgress - 0.4) / 0.2;
              scale = gsap.utils.interpolate(
                0.75,
                1,
                smoothStep(normalizedProgress)
              );
            } else {
              scale = 1;
            }

            let opacity;
            if (cardProgress < 0.2) {
              const normalizedProgress = cardProgress / 0.2;
              opacity = smoothStep(normalizedProgress);
            } else {
              opacity = 1;
            }

            let x, rotate, rotationY;
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "33%" : index === 2 ? "-33%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? -2 : index === 2 ? 2 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const normalizedProgress = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(
                index === 0 ? "100%" : index === 1 ? "33%" : index === 2 ? "-33%" : "-100%",
                "0%",
                smoothStep(normalizedProgress)
              );
              rotate = gsap.utils.interpolate(
                index === 0 ? -5 : index === 1 ? -2 : index === 2 ? 2 : 5,
                0,
                smoothStep(normalizedProgress)
              );
              rotationY = smoothStep(normalizedProgress) * 180;
            } else {
              x = "0%";
              rotate = 0;
              rotationY = 180;
            }

            gsap.set(cardId, {
              opacity: opacity,
              y: y,
              x: x,
              rotate: rotate,
              scale: scale,
            });

            gsap.set(innerCard, {
              rotationY: rotationY,
            });

            // Stop floating animation when cards are fully positioned
            const cardWrapper = document.querySelector(`${cardId} .card-wrapper`);
            if (cardProgress >= 1) {
              gsap.set(cardWrapper, {
                animation: 'none',
                transform: 'translate(-50%, -50%)'
              });
            } else {
              // Re-enable floating animation when cards are not fully positioned
              gsap.set(cardWrapper, {
                animation: 'floating 2s infinite ease-in-out',
                animationDelay: `${index * 0.2}s`
              });
            }
          });
        },
      });
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="scroll-animation-root">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap");

        :root {
          --dark: #000;
          --light: #f9f4eb;
          --light2: #f0ece5;
          --accent-1: #000;
          --accent-2: #000;
          --accent-3: #000;
          --accent-4: #000;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "DM Sans";
          background-color: var(--dark);
          color: var(--light);
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 500;
        }

        p {
          font-size: 1.1rem;
          font-weight: 500;
        }

        span {
          text-transform: uppercase;
          font-family: "DM Mono";
          font-size: 0.75rem;
          font-weight: 500;
        }

        nav {
          position: fixed;
          width: 100%;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .logo span,
        .menu-btn span {
          font-size: 0.8rem;
          padding: 0.75rem;
          border-radius: 0.25rem;
        }

        .logo span {
          background-color: var(--dark);
          color: var(--light);
        }

        .menu-btn span {
          background-color: var(--light2);
          color: var(--dark);
        }

        section {
          position: relative;
          width: 100%;
          height: 100svh;
          padding: 2rem;
          overflow: hidden;
        }

        .hero {
          background-color: transparent;
          color: var(--light);
        }

        .about,
        .outro {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          color: var(--light);
        }

        .hero-cards {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .hero-cards .card {
          flex: 1;
          position: relative;
          aspect-ratio: 5/7;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 2px solid white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 170px;
          box-sizing: border-box;
        }

        .card-title {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .hero-cards .card span {
          font-size: 0.8rem;
          color: white;
        }

        .hero-cards .card#hero-card-1 {
          background-color: var(--accent-1);
          transform-origin: top right;
          z-index: 3;
        }

        .hero-cards .card#hero-card-2 {
          background-color: var(--accent-2);
          z-index: 2;
        }

        .hero-cards .card#hero-card-3 {
          background-color: var(--accent-3);
          z-index: 1;
        }

        .hero-cards .card#hero-card-4 {
          background-color: var(--accent-4);
          transform-origin: top left;
          z-index: 0;
        }

        .services {
          padding: 8rem 2rem;
          background-color: transparent;
          color: var(--light);
        }

        .services-header {
          position: relative;
          width: 100%;
          text-align: center;
          transform: translateY(400%);
          will-change: transform;
        }

        .cards {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100svh;
          display: flex;
          justify-content: center;
          z-index: -1;
          
        }

        .cards-container {
          position: relative;
          width: 85%;
          height: 100%;
          margin-top: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
        }

        .cards-container .card {
          flex: 1;
          position: relative;
          aspect-ratio: 5/7;
          perspective: 1000px;
          min-width: 150px;
        }

        .cards-container .card .card-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          animation: floating 2s infinite ease-in-out;
        }

        @keyframes floating {
          0% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, -55%);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }

        #card-1 .card-wrapper {
          animation-delay: 0;
        }

        #card-2 .card-wrapper {
          animation-delay: 0.2s;
        }

        #card-3 .card-wrapper {
          animation-delay: 0.4s;
        }

        #card-4 .card-wrapper {
          animation-delay: 0.6s;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          backface-visibility: hidden;
          overflow: hidden;
          color: white;
        }

        .flip-card-front {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          border: 2px solid white;
        }

        #card-1 .flip-card-front {
          background-color: var(--accent-1);
        }

        #card-2 .flip-card-front {
          background-color: var(--accent-2);
        }

        #card-3 .flip-card-front {
          background-color: var(--accent-3);
        }

        #card-4 .flip-card-front {
          background-color: var(--accent-4);
        }

        .flip-card-back {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
          background-color: #000;
          border: 2px solid white;
          transform: rotateY(180deg);
        }

        .card-copy {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-copy p {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
          color: white;
          border-radius: 0.25rem;
          border: 1px solid white;
          background: none;
        }
        .scroll-animation-root .card-copy p:first-child {
          background: none;
          color: white;
          font-weight: 900;
          font-size: 1.2rem;
          border: none;
        }

        .cards #card-1 {
          transform: translateX(100%) translateY(-100%) rotate(-5deg) scale(0.25);
          z-index: 3;
        }

        .cards #card-2 {
          transform: translateX(33%) translateY(-100%) rotate(-2deg) scale(0.25);
          z-index: 2;
        }

        .cards #card-3 {
          transform: translateX(-33%) translateY(-100%) rotate(2deg) scale(0.25);
          z-index: 1;
        }

        .cards #card-4 {
          transform: translateX(-100%) translateY(-100%) rotate(5deg) scale(0.25);
          z-index: 0;
        }

        .cards .cards-container .card {
          opacity: 0;
        }

        .mobile-cards {
          display: none;
        }

        @media (max-width: 1000px) {
          .hero-cards {
            width: calc(100% - 4rem);
            gap: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
          }

          .hero-cards .card {
            min-width: 140px;
            padding: 1rem;
            flex: 0 0 calc(50% - 0.75rem);
            max-width: calc(50% - 0.75rem);
          }

          .hero-cards .card span {
            font-size: 0.8rem;
          }

          .services {
            min-height: 100svh;
            height: 100%;
          }

          .services-header {
            transform: translateY(0%);
          }

          .mobile-cards {
            display: block;
            height: 100%;
          }

          .mobile-cards .cards-container {
            width: calc(100% - 4rem);
            display: block;
            height: 100%;
            margin: 4rem auto;
          }

          .mobile-cards .cards-container .card {
            margin-bottom: 2rem;
            min-width: 120px;
          }

          .mobile-cards .cards-container .card-wrapper {
            animation: none;
          }

          .mobile-cards .card .flip-card-front {
            transform: rotateY(180deg);
          }

          .mobile-cards .flip-card-back {
            transform: rotateY(0deg);
          }
        }

        @media (max-width: 768px) {
          .hero-cards {
            width: calc(100% - 2rem);
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
          }

          .hero-cards .card {
            min-width: 120px;
            padding: 0.75rem;
            flex: 0 0 calc(50% - 0.5rem);
            max-width: calc(50% - 0.5rem);
          }

          .hero-cards .card span {
            font-size: 0.7rem;
          }

          .mobile-cards .cards-container {
            width: calc(100% - 2rem);
          }

          .mobile-cards .cards-container .card {
            min-width: 100px;
          }
        }

        @media (max-width: 480px) {
          .hero-cards {
            width: calc(100% - 1rem);
            gap: 0.75rem;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
          }

          .hero-cards .card {
            min-width: 100px;
            padding: 0.6rem;
            flex: 0 0 calc(50% - 0.375rem);
            max-width: calc(50% - 0.375rem);
          }

          .hero-cards .card span {
            font-size: 0.6rem;
          }

          .mobile-cards .cards-container {
            width: calc(100% - 1rem);
          }

          .mobile-cards .cards-container .card {
            min-width: 80px;
          }
        }
        .scroll-animation-root .card-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
        .scroll-animation-root .card-content h2 {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #fff;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
          line-height: 1.1;
          text-shadow: 0 2px 16px rgba(0,0,0,0.25), 0 1px 0 #222;
        }
        .scroll-animation-root .card-content p {
          font-size: 0.98rem;
          font-weight: 400;
          color: #e0e0e0;
          line-height: 1.6;
          letter-spacing: 0.01em;
          text-align: center;
          text-shadow: 0 1px 8px rgba(0,0,0,0.18);
        }
        .scroll-animation-root .hero-cards .card-content {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .scroll-animation-root .card-content h2 {
            font-size: 1.1rem;
          }
          .scroll-animation-root .card-content p {
            font-size: 0.65rem;
            text-align: center;
          }
          .scroll-animation-root .card-copy p {
            font-size: 0.65rem;
            text-align: center;
          }
          .scroll-animation-root .card-copy p:first-child {
            font-size: 0.85rem;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .scroll-animation-root .card-content h2 {
            font-size: 0.95rem;
          }
          .scroll-animation-root .card-content p {
            font-size: 0.55rem;
            text-align: center;
          }
          .scroll-animation-root .card-copy p {
            font-size: 0.55rem;
            text-align: center;
          }
          .scroll-animation-root .card-copy p:first-child {
            font-size: 0.7rem;
            text-align: center;
          }
            
        }

        /* Override hero cards and flip cards to always have a solid background */
        .hero-cards .card {
          background: #fff !important;
        }
        :global(.dark) .hero-cards .card {
          background: #000 !important;
        }
        .flip-card-front,
        .flip-card-back {
          background: #fff !important;
        }
        :global(.dark) .flip-card-front,
        :global(.dark) .flip-card-back {
          background: #000 !important;
        }

        /* Our Services heading style (matches contact.tsx heading) */
        .services-header h1 {
          font-family: 'Barlow', sans-serif !important;
          font-size: 2rem !important; /* text-3xl */
          font-weight: 800 !important; /* font-extrabold */
          color: #000 !important;
        }
        @media (min-width: 640px) {
          .services-header h1 {
            font-size: 2.25rem !important; /* sm:text-4xl */
          }
        }
        @media (min-width: 768px) {
          .services-header h1 {
            font-size: 3rem !important; /* md:text-5xl */
          }
        }
        @media (min-width: 1024px) {
          .services-header h1 {
            font-size: 3.75rem !important; /* lg:text-6xl */
          }
        }
        :global(.dark) .services-header h1 {
          color: #fff !important;
        }

        /* Use font-sans for all other text in services.tsx */
        .scroll-animation-root,
        .scroll-animation-root *:not(h1):not(.font-barlow) {
          font-family: 'Inter', 'DM Sans', 'DM Mono', system-ui, sans-serif !important;
        }

        /* Light theme: black for border, text, etc. */
        .hero-cards .card,
        .flip-card-front,
        .flip-card-back {
          background: #fff !important;
          color: #000 !important;
          border: 2px solid #000 !important;
        }
        .hero-cards .card *,
        .flip-card-front *,
        .flip-card-back * {
          color: #000 !important;
        }
        .flip-card-back p:not(:first-child) {
          border: 1.5px solid #000 !important;
        }
        .flip-card-back p:first-child {
          border: none !important;
        }

        /* Dark theme: white for border, text, etc. */
        :global(.dark) .hero-cards .card,
        :global(.dark) .flip-card-front,
        :global(.dark) .flip-card-back {
          background: #000 !important;
          color: #fff !important;
          border: 2px solid #fff !important;
        }
        :global(.dark) .hero-cards .card *,
        :global(.dark) .flip-card-front *,
        :global(.dark) .flip-card-back * {
          color: #fff !important;
        }
        :global(.dark) .flip-card-back p:not(:first-child) {
          border: 1.5px solid #fff !important;
        }
        :global(.dark) .flip-card-back p:first-child {
          border: none !important;
        }
      `}</style>

      <section className="hero">
        <div className="hero-cards">
          <div className="card" id="hero-card-1">
            <div className="card-content">
              <h2 className="font-barlow font-extrabold">PLAN</h2>
              <p className="font-sans">We break down your vision, define workflows, and align every step with growth-focused outcomes.</p>
            </div>
          </div>

          <div className="card" id="hero-card-2">
            <div className="card-content">
              <h2 className="font-barlow font-extrabold">DESIGN</h2>
              <p className="font-sans">We design fast and functional UX that turns complex ideas into user-first and AI-ready interfaces.</p>
            </div>
          </div>

          <div className="card" id="hero-card-3">
            <div className="card-content">
              <h2 className="font-barlow font-extrabold">DEVELOP</h2>
              <p className="font-sans">We build AI-powered platforms with clean, scalable code built for performance and results.</p>
            </div>
          </div>

          <div className="card" id="hero-card-4">
            <div className="card-content">
              <h2 className="font-barlow font-extrabold">LAUNCH</h2>
              <p className="font-sans">We deploy, monitor, and support your product to deliver real-world impact from day one.</p>
            </div>
          </div>
        </div>
      </section>

      <MilestonesSection />

      <section className="services">
        <div className="services-header">
          <h1>Our Services</h1>
        </div>

        <div className="mobile-cards">
          <div className="cards-container">
            <div className="card" id="mobile-card-1">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-content">
                      <h2 className="font-barlow font-extrabold">PLAN</h2>
                      <p className="font-sans">We break down your vision, define workflows, and align every step with growth-focused outcomes.</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title"><h2></h2></div>
                    <div className="card-copy">
                      <p className="font-barlow font-extrabold">AI SaaS Platforms</p>
                      <p className="font-sans">AI platforms built from scratch</p>
                      <p className="font-sans">Multi-tenant systems with control</p>
                      <p className="font-sans">Dashboards that cut manual work</p>
                      <p className="font-sans">Billing, auth, and API ready</p>
                      <p className="font-sans">Scalable, compliant, deployment-ready</p>
                    </div>
                    <div className="card-title"><h2></h2></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" id="mobile-card-2">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-content">
                      <h2 className="font-barlow font-extrabold">DESIGN</h2>
                      <p className="font-sans">We design fast, functional UX that turns complex ideas into user-first, AI-ready interfaces.</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title"><h2></h2></div>
                    <div className="card-copy">
                      <p className="font-barlow font-extrabold">Automation & AI Agents</p>
                      <p className="font-sans">AI agents for daily tasks</p>
                      <p className="font-sans">Auto-handle email and CRM</p>
                      <p className="font-sans">Form parsing and document reading</p>
                      <p className="font-sans">Trigger-based workflow automation</p>
                      <p className="font-sans">Trained on your business data</p>
                    </div>
                    <div className="card-title"><h2></h2></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" id="mobile-card-3">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-content">
                      <h2 className="font-barlow font-extrabold">DEVELOP</h2>
                      <p className="font-sans">We build AI-powered platforms with clean, scalable code built for performance and results.</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title"><h2></h2></div>
                    <div className="card-copy">
                      <p className="font-barlow font-extrabold">Conversational AI</p>
                      <p className="font-sans">Custom chatbots for support</p>
                      <p className="font-sans">Voice assistants for interaction</p>
                      <p className="font-sans">Lead capture and follow-up</p>
                      <p className="font-sans">Website and WhatsApp ready</p>
                      <p className="font-sans">Natural language routing flows</p>
                    </div>
                    <div className="card-title"><h2></h2></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" id="mobile-card-4">
              <div className="card-wrapper">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-content">
                      <h2 className="font-barlow font-extrabold">LAUNCH</h2>
                      <p className="font-sans">We deploy, monitor, and support your product to deliver real-world impact from day one.</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-title"><h2></h2></div>
                    <div className="card-copy">
                      <p className="font-barlow font-extrabold">Analytics & Vision Intelligence</p>
                      <p className="font-sans">Dashboards with live insights</p>
                      <p className="font-sans">Predictive trends and alerts</p>
                      <p className="font-sans">Image and video recognition</p>
                      <p className="font-sans">Object tracking and activity tagging</p>
                      <p className="font-sans">AI search for visual data</p>
                    </div>
                    <div className="card-title"><h2></h2></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="cards-container">
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-content">
                    <h2 className="font-barlow font-extrabold">PLAN</h2>
                    <p className="font-sans">We break down your vision, define workflows, and align every step with growth-focused outcomes.</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><h2></h2></div>
                  <div className="card-copy">
                    <p className="font-barlow font-extrabold">AI SaaS Platforms</p>
                    <p className="font-sans">AI platforms built from scratch</p>
                    <p className="font-sans">Multi-tenant systems with control</p>
                    <p className="font-sans">Dashboards that cut manual work</p>
                    <p className="font-sans">Billing, auth, and API ready</p>
                    <p className="font-sans">Scalable, compliant, deployment-ready</p>
                  </div>
                  <div className="card-title"><h2></h2></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-content">
                    <h2 className="font-barlow font-extrabold">DESIGN</h2>
                    <p className="font-sans">We design fast, functional UX that turns complex ideas into user-first, AI-ready interfaces.</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><h2></h2></div>
                  <div className="card-copy">
                    <p className="font-barlow font-extrabold">Automation & AI Agents</p>
                    <p className="font-sans">AI agents for daily tasks</p>
                    <p className="font-sans">Auto-handle email and CRM</p>
                    <p className="font-sans">Form parsing and document reading</p>
                    <p className="font-sans">Trigger-based workflow automation</p>
                    <p className="font-sans">Trained on your business data</p>
                  </div>
                  <div className="card-title"><h2></h2></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-content">
                    <h2 className="font-barlow font-extrabold">DEVELOP</h2>
                    <p className="font-sans">We build AI-powered platforms with clean, scalable code built for performance and results.</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><h2></h2></div>
                  <div className="card-copy">
                    <p className="font-barlow font-extrabold">Conversational AI</p>
                    <p className="font-sans">Custom chatbots for support</p>
                    <p className="font-sans">Voice assistants for interaction</p>
                    <p className="font-sans">Lead capture and follow-up</p>
                    <p className="font-sans">Website and WhatsApp ready</p>
                    <p className="font-sans">Natural language routing flows</p>
                  </div>
                  <div className="card-title"><h2></h2></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-4">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-content">
                    <h2 className="font-barlow font-extrabold">LAUNCH</h2>
                    <p className="font-sans">We deploy, monitor, and support your product to deliver real-world impact from day one.</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title"><h2></h2></div>
                  <div className="card-copy">
                    <p className="font-barlow font-extrabold">Analytics & Vision Intelligence</p>
                    <p className="font-sans">Dashboards with live insights</p>
                    <p className="font-sans">Predictive trends and alerts</p>
                    <p className="font-sans">Image and video recognition</p>
                    <p className="font-sans">Object tracking and activity tagging</p>
                    <p className="font-sans">AI search for visual data</p>
                  </div>
                  <div className="card-title"><h2></h2></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default ScrollAnimation; 