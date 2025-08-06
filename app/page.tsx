"use client"
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import Svg from "@/components/svg";
import Brands from "@/components/brands";
import HeroIntegrationsSection from "@/components/hero-integrations-section";
import Milestones from "@/components/milestones";
import Services from "@/components/Services";
import Testimonials from "@/components/testimonials";
import Blogs from "@/components/blogs";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";
import Newsletter from "@/components/newsletter";
import Contact from "@/components/contact";
import Teams from "@/components/teams";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* === Background Tile Images Only at Corners === */}
      <div className="background-tiles pointer-events-none">
        <img
          src="https://cdn.prod.website-files.com/66d5553aa640d66c668df6f1/66da7f5d7c141ac49ea9e563_HIW%20Background%20Left.avif"
          loading="lazy"
          alt=""
          className="image-full"
        />
      </div>

      <div className="background-tiles right pointer-events-none">
        <img
          src="https://cdn.prod.website-files.com/66d5553aa640d66c668df6f1/66da7f5df1e7ae1868432218_HIW%20Background%20Right.avif"
          loading="lazy"
          alt=""
          className="image-full"
        />
      </div>

      {/* === Foreground Page Content === */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* <HeroSection /> */}
          {/* <HeroIntegrationsSection /> */}
          <div id="svg"><Svg /></div>
          <div id="brands"><Brands /></div>
          {/* <Milestones /> */}
          <div id="services"><Services /></div>
          <div className="w-full py-16 md:py-24" id="projects">
            <div className="text-center mb-16 md:mb-24 px-4 md:px-8 font-barlow">
              <h1
                className={`
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-barlow mb-8 md:mb-12 tracking-tight text-white
                `}
              >
                Our <span className="text-white">Projects</span>
              </h1>
              <p
                className={`
                  text-lg sm:text-xl max-w-3xl md:max-w-6xl mx-auto leading-relaxed font-sans text-white font-normal
                `}
              >
                A journey through Our creative works and technical achievements
              </p>
            </div>
            <Timeline />
          </div>
          <div id="testimonials"><Testimonials /></div>
          <div id="team"><Teams /></div>
          <div id="blogs"><Blogs /></div>
          <div id="contact"><Contact /></div>
          <div id="newsletter"><Newsletter /></div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
