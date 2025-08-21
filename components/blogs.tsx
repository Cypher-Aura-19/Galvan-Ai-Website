"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/components/theme-provider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  _id?: string;
  id?: number;
  title: string
  excerpt: string
  author: {
    name: string
    avatar: string
    role: string
    bio: string
  }
  readTime: string
  views: string
  publishDate: string
  category: string
  image: string
  tags?: string[]
  featured?: boolean
}

interface Category {
  id: string
  name: string
  count: number
}

export default function Component() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const blogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch("/api/blog-posts");
        const data = await res.json();
        // Ensure each post has id = _id for compatibility
        setPosts(data.map((post: any) => ({ ...post, id: post._id })));
      } catch {
        setPosts([]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!blogsRef.current || posts.length === 0) return;
    
    const ctx = gsap.context(() => {
      // Initial entrance animations that play immediately
      gsap.set(".blog-element", { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(".blogs-header", { opacity: 0, y: 50, scale: 0.8 });
      gsap.set(".blogs-sidebar", { opacity: 0, x: -80, scale: 0.9 });
      gsap.set(".blogs-featured-section", { opacity: 0, y: 80, scale: 0.9 });

      // Entrance sequence with timeline
      const tl = gsap.timeline();
      
      tl.to(".blogs-header", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out"
      })
      .to(".blogs-sidebar", {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.6")
      .to(".blogs-featured-section", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.4")
      .to(".blog-element", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Scroll-triggered animations
      gsap.fromTo(
        ".blogs-header",
        { opacity: 0, y: 80, scale: 0.9, rotationX: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blogs-header",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Removed sparkles animation

      // Removed badge animation

      // Sidebar animations with staggered effect
      gsap.fromTo(
        ".blogs-sidebar",
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blogs-sidebar",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Category buttons staggered animation
      gsap.fromTo(
        ".blogs-category-item",
        { opacity: 0, x: -40, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blogs-sidebar",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Featured post section animation
      gsap.fromTo(
        ".blogs-featured-section",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blogs-featured-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Featured post card animation
      gsap.fromTo(
        ".blogs-featured-card",
        { opacity: 0, y: 80, scale: 0.9, rotationY: 5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blogs-featured-card",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Navigation controls animation
        gsap.fromTo(
        ".blogs-navigation",
        { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
          scale: 1,
            duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blogs-navigation",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Navigation info animation
      gsap.fromTo(
        ".blogs-navigation-info",
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
            trigger: ".blogs-navigation-info",
            start: "top 80%",
            toggleActions: "play none none reverse",
            },
          }
        );
    }, blogsRef);
    return () => ctx.revert();
  }, [posts.length]);

  // Dynamically generate categories from posts
  const categoryMap: Record<string, number> = {};
  posts.forEach(post => {
    if (post.category) {
      categoryMap[post.category] = (categoryMap[post.category] || 0) + 1;
    }
  });
  const categories = [
    { id: "all", name: "All Stories", count: posts.length },
    ...Object.entries(categoryMap).map(([cat, count]) => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1), count }))
  ];

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter((post) => post.category === selectedCategory);

  const currentPost = filteredPosts[currentPostIndex] || filteredPosts[0];

  const handlePrevious = () => {
    setCurrentPostIndex((prev) => (prev > 0 ? prev - 1 : filteredPosts.length - 1));
  };

  const handleNext = () => {
    setCurrentPostIndex((prev) => (prev < filteredPosts.length - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPostIndex(0);
  };

  const FeaturedCard = ({ post }: { post: BlogPost }) => (
    <Card className={`blogs-featured-card blog-element group relative overflow-hidden border-2 transition-all duration-700 cursor-pointer h-[450px] sm:h-[550px] hover:scale-[1.02] hover:shadow-2xl ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${
      isDark
        ? 'border-blue-500/20 hover:border-blue-400/40'
        : 'border-blue-500/20 hover:border-blue-400/40'
    }`}>
      <CardContent className="p-0 h-full relative">
        {/* Background Image */}
          <div className="absolute inset-0">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/60 to-black/20' : 'from-white via-white/60 to-white/20'}`} />
            {/* Decorative corners */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className={`absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 rounded-tr-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
              <div className={`absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 rounded-bl-2xl ${isDark ? 'border-blue-400/30' : 'border-blue-400/30'}`}></div>
            </div>
        </div>
        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-10">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <Badge className={`border px-4 py-2 text-sm font-sans font-medium transition-all duration-300 hover:scale-110 rounded-xl bg-transparent backdrop-blur-[3.1px] ${isDark ? 'border-blue-400/40 text-white' : 'border-blue-400/40 text-black'}`}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </div>
          {/* Bottom Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Author Info */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Avatar className={`h-10 w-10 sm:h-16 sm:w-16 ring-2 transition-all duration-300 hover:scale-110 ${isDark ? "ring-white" : "ring-black"}`}>
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback className={`${isDark ? 'bg-white text-black' : 'bg-black text-white'} font-bold text-lg font-barlow`}>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-extrabold text-lg font-barlow transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>{post.author.name}</p>
                <p className={`text-sm font-medium font-sans transition-colors duration-300 ${isDark ? 'text-white/80' : 'text-black/80'}`}>{post.author.role}</p>
                <div className="flex space-x-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
                  ))}
                </div>
              </div>
            </div>
            {/* Title */}
            <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight font-barlow transition-all duration-300 hover:scale-[1.02] ${isDark ? 'text-white' : 'text-black'}`}>{post.title}</h2>
            {/* Excerpt */}
            <p className={`text-base sm:text-xl leading-relaxed max-w-4xl font-sans transition-colors duration-300 ${isDark ? 'text-white/90' : 'text-black/80'} line-clamp-2`}>
              {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
            </p>
            {/* Meta Info and CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 sm:pt-4 gap-4 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-6">
                <div className={`flex items-center space-x-2 rounded-xl px-3 py-1 sm:px-4 sm:py-2 border transition-all duration-300 hover:scale-110 bg-transparent backdrop-blur-[3.1px] ${isDark ? 'border-blue-400/40 text-white' : 'border-blue-400/40 text-black'}`}>
                  <Clock className={`h-4 w-4 ${isDark ? 'text-white' : 'text-black'}`} />
                  <span className={`font-medium font-sans`}>{post.readTime}</span>
                </div>

                <div className={`flex items-center space-x-2 rounded-xl px-3 py-1 sm:px-4 sm:py-2 border transition-all duration-300 hover:scale-110 bg-transparent backdrop-blur-[3.1px] ${isDark ? 'border-blue-400/40 text-white' : 'border-blue-400/40 text-black'}`}>
                  <Calendar className={`h-4 w-4 ${isDark ? 'text-white' : 'text-black'}`} />
                  <span className={`font-medium font-sans`}>{post.publishDate}</span>
                </div>
              </div>
              <Button
                asChild
                className={`${isDark ? "bg-white hover:bg-white/90 text-black" : "bg-black hover:bg-black/90 text-white"} border-0 rounded-xl px-8 sm:px-10 py-2 sm:py-3 font-semibold text-base sm:text-lg transition-all duration-300 font-barlow min-w-[160px] sm:min-w-[180px] hover:scale-105 hover:shadow-xl`}
              >
                <Link
                  href={`/blogs/${post._id || post.id}`}
                  prefetch
                  onMouseEnter={() => {
                    const pid = post._id || post.id;
                    if (pid) fetch(`/api/blog-posts/${pid}`).catch(() => {});
                  }}
                  onFocus={() => {
                    const pid = post._id || post.id;
                    if (pid) fetch(`/api/blog-posts/${pid}`).catch(() => {});
                  }}
                >
                  <span className="flex items-center justify-center w-full">
                    Read Article
                    <ArrowUpRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
        <div className={`text-xl ${isDark ? "text-white" : "text-black"}`}>Loading blogs...</div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
                      <div className={`rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full border bg-transparent backdrop-blur-[2.1px] ${isDark ? "border-zinc-800" : "border-zinc-300"}`}>
            <h2 className={`text-4xl font-extrabold mb-3 text-center tracking-tight ${isDark ? "text-white" : "text-black"}`}>No Blogs Yet</h2>
            <p className={`text-xl text-center max-w-2xl mb-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Start by adding your first blog post! Your blogs will appear here in this beautiful, modern showcase.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={blogsRef} className={`w-full px-2 sm:px-6 relative overflow-hidden min-h-screen ${isDark ? "text-white" : "text-black"}`}>
      <div className="w-full max-w-[1700px] mx-auto relative z-10 h-full flex flex-col">
        {/* Header */}
            <div className="blogs-header text-center py-8 sm:py-12 bg-transparent backdrop-blur-[3.1px] rounded-2xl">
          <div className="mb-4 sm:mb-6" />
          <h1 className={`font-extrabold mb-2 sm:mb-4 font-barlow text-3xl sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-300 hover:scale-[1.02] ${isDark ? "text-white" : "text-black"}`}>Discover Amazing Stories</h1>
          <p className={`${isDark ? "text-white/70" : "text-black/70"} text-base sm:text-xl max-w-2xl mx-auto font-sans`}>
            Explore insights, journeys, and perspectives from our community
          </p>
        </div>
        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 pb-0 items-start">
          {/* Sidebar */}
            <div className="blogs-sidebar lg:col-span-1 w-full">
            {/* Categories */}
            <div className={`rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl h-[450px] sm:h-[550px] mt-12 sm:mt-20 ${
              isDark ? 'border-blue-500/20 hover:border-blue-400/40'
                    : 'border-blue-500/20 hover:border-blue-400/40'
            }`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-4 font-barlow ${isDark ? "text-white" : "text-black"}`}>Categories</h3>
              <div className="space-y-4 sm:space-y-6 h-[calc(100%-4rem)] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`blogs-category-item blog-element w-full justify-between text-left h-auto p-3 sm:p-4 rounded-xl transition-all duration-500 border text-base sm:text-lg font-sans font-medium hover:scale-105 hover:shadow-lg ${isDark ? 'bg-black/40' : 'bg-black/5'} hover:${isDark ? 'bg-black/40' : 'bg-black/5'} active:${isDark ? 'bg-black/40' : 'bg-black/5'} focus:${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${
                      selectedCategory === category.id
                        ? isDark
                          ? 'text-white border-blue-400/50'
                          : 'text-black border-blue-400/50'
                        : isDark
                        ? 'text-white/80 hover:text-white/80 border-blue-500/20 hover:border-blue-400/40'
                        : 'text-black/80 hover:text-black/80 border-blue-500/20 hover:border-blue-400/40'
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <span className={`font-medium font-sans`}>{category.name}</span>
                    <Badge
                      className={`border px-2 sm:px-3 py-1 font-sans text-xs sm:text-base transition-all duration-300 hover:scale-110 ${
                        selectedCategory === category.id
                          ? isDark
                            ? 'bg-white/10 text-white border-blue-400/50'
                            : 'bg-black/5 text-black border-blue-400/50'
                          : isDark
                          ? 'bg-black/20 text-white border-blue-500/20'
                          : 'bg-white/60 text-black border-blue-500/20'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8 w-full">
            {/* Featured Post with Navigation */}
            <div className="blogs-featured-section bg-transparent rounded-2xl">
              <div className="blogs-navigation blog-element flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 gap-4 sm:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <h2 className={`font-bold font-barlow text-2xl sm:text-3xl transition-all duration-300 hover:scale-105 ${isDark ? "text-white" : "text-black"}`}>Featured Story</h2>
                                  </div>
                {/* Navigation Controls */}
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <div className={`text-xs sm:text-sm font-medium rounded-xl px-3 sm:px-4 py-1 sm:py-2 font-sans border-2 transition-all duration-300 hover:scale-110 ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${isDark ? "border-white text-white/70" : "border-black text-black/70"}`}>
                    {currentPostIndex + 1} of {filteredPosts.length}
                  </div>
                  <div className="flex space-x-2 sm:space-x-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handlePrevious}
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl transition-all duration-300 border-2 hover:scale-110 ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${isDark ? "border-white" : "border-black"}`}
                      disabled={filteredPosts.length <= 1}
                    >
                      <ChevronLeft className={`${isDark ? "text-white" : "text-black"} h-5 w-5`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleNext}
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl transition-all duration-300 border-2 hover:scale-110 ${isDark ? 'bg-black/40' : 'bg-black/5'} backdrop-blur-xl ${isDark ? "border-white" : "border-black"}`}
                      disabled={filteredPosts.length <= 1}
                    >
                      <ChevronRight className={`${isDark ? "text-white" : "text-black"} h-5 w-5`} />
                    </Button>
                  </div>
                </div>
              </div>
              <FeaturedCard post={currentPost} />
            </div>
            {/* Navigation Info */}
            <div className={`blogs-navigation-info blog-element flex items-center justify-center space-x-4 sm:space-x-6`}>
              <span className={`text-xs sm:text-sm font-sans ${isDark ? 'text-white/60' : 'text-black/60'}`}>Use navigation to explore more stories</span>
              <div className="flex space-x-1 sm:space-x-2">
                {filteredPosts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 hover:scale-150 ${
                      index === currentPostIndex
                        ? isDark
                          ? "bg-white"
                          : "bg-black"
                        : isDark
                        ? "bg-white/30"
                        : "bg-black/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
