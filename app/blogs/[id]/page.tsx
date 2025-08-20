"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Calendar, 
  Share2, 
  Bookmark, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Heart,
  MessageCircle,
  ChevronUp,
  Tag,
  User,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon } from 'lucide-react';
import BrandedLoading from '@/components/BrandedLoading';
import AnimatedGridBg from "@/components/AnimatedGridBg";
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';

export default function BlogDetailPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [post, setPost] = useState<any | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    async function fetchPostAndRelated() {
      setLoading(true);
      try {
        const res = await fetch("/api/blog-posts");
        const data = await res.json();
        const found = data.find((p: any) => p._id === id || p.id == id);
        setPost(found || null);
        setRelatedPosts(data.filter((p: any) => (p._id || p.id) !== (found?._id || found?.id)).slice(0, 3));
      } catch {
        setPost(null);
        setRelatedPosts([]);
      }
      setLoading(false);
    }
    fetchPostAndRelated();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <AnimatedGridBg />
        <div className="relative z-10">
          <Navbar />
          <main>
            <div className="min-h-screen flex items-center justify-center">
              <BrandedLoading minDuration={7000} />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <AnimatedGridBg />
        <div className="relative z-10">
          <Navbar />
          <main>
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[400px]">
                <div className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-3xl shadow-2xl p-16 flex flex-col items-center w-full">
                  <h1 className="text-4xl font-extrabold mb-3 text-center text-black dark:text-white tracking-tight">Blog Post Not Found</h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xl text-center max-w-2xl mb-2">The blog post you're looking for doesn't exist.</p>
                  <Button asChild variant="outline" className="border-zinc-300 dark:border-white/20 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 mt-6">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* === Animated Grid Background === */}
      <AnimatedGridBg />
      
      {/* === Foreground Page Content === */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-white/10 z-50">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* Hero Section */}
          <div className="relative w-full h-[70vh] overflow-hidden bg-white dark:bg-black pt-20 lg:pt-24">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black via-black/60 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-8 left-8 z-10">
          <Button
            asChild
            variant="ghost"
            className="bg-zinc-100/80 dark:bg-black/20 backdrop-blur-md border border-zinc-300 dark:border-white/20 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-400 dark:hover:border-white/30"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-[1700px] mx-auto w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-zinc-200 dark:bg-white/20 text-black dark:text-white border-zinc-300 dark:border-white/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl text-black dark:text-white">
              <span className="font-barlow font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-black dark:text-white">{post.title}</span>
            </h1>
            <div className="flex items-center gap-6 text-zinc-700 dark:text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1700px] mx-auto w-full px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Author Info */}
            <Card className={`bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md mb-8 transition-all duration-500 hover:scale-[1.02] ${
              isDark
                ? 'hover:bg-black/40 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
                : 'hover:bg-black/5 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-zinc-300 dark:border-white/20">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                        {post.author.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white">{post.author.name}</h3>
                      <p className="text-zinc-600 dark:text-gray-400">{post.author.role}</p>
                      <p className="text-sm text-zinc-500 dark:text-gray-500 mt-1">{post.author.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Body */}
            <Card className={`bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md mb-8 transition-all duration-500 hover:scale-[1.02] ${
              isDark
                ? 'hover:bg-black/40 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
                : 'hover:bg-black/5 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
            }`}>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none font-sans text-black dark:text-white">
                  <p className="font-sans text-xl text-black dark:text-white leading-relaxed mb-6 font-light">
                    {post.excerpt}
                  </p>
                  <h2 className="font-barlow font-extrabold text-2xl mb-4 mt-8 text-black dark:text-white">Introduction</h2>
                  <p className="font-sans text-black dark:text-white leading-relaxed mb-6">
                    {post.intro}
                  </p>
                  <h2 className="font-barlow font-extrabold text-2xl mb-4 mt-8 text-black dark:text-white">Key Concepts</h2>
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
                    <h3 className="font-barlow font-extrabold text-lg mb-3 text-blue-700 dark:text-blue-400">Important Note</h3>
                    <ul className="font-sans list-disc list-inside text-black dark:text-white space-y-2 mb-0">
                      {post.keyConcepts?.map((concept: string, i: number) => (
                        <li key={i}>{concept}</li>
                      ))}
                    </ul>
                  </div>
                  <h2 className="font-barlow font-extrabold text-2xl mb-4 mt-8 text-black dark:text-white">Implementation</h2>
                  <p className="font-sans text-black dark:text-white leading-relaxed mb-6">
                    {post.implementation}
                  </p>
                  <h2 className="font-barlow font-extrabold text-2xl mb-4 mt-8 text-black dark:text-white">Best Practices</h2>
                  <ul className="font-sans list-disc list-inside text-black dark:text-white space-y-2 mb-6">
                    {post.bestPractices?.map((practice: string, i: number) => (
                      <li key={i}>{practice}</li>
                    ))}
                  </ul>
                  <h2 className="font-barlow font-extrabold text-2xl mb-4 mt-8 text-black dark:text-white">Conclusion</h2>
                  <p className="font-sans text-black dark:text-white leading-relaxed mb-6">
                    {post.conclusion}
                  </p>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <Card className={`bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] ${
                isDark
                  ? 'hover:bg-black/40 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
                  : 'hover:bg-black/5 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
              }`}>
                <CardContent className="p-6">
                  <h3 className="font-barlow font-extrabold mb-4 flex items-center gap-2 text-black dark:text-white">
                    <Tag className="w-4 h-4" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className={`block text-sm transition-colors duration-300 ${
                      isDark 
                        ? 'text-zinc-600 hover:text-blue-400' 
                        : 'text-zinc-600 hover:text-blue-600'
                    }`}>
                      Introduction
                    </a>
                    <a href="#key-concepts" className={`block text-sm transition-colors duration-300 ${
                      isDark 
                        ? 'text-zinc-600 hover:text-blue-400' 
                        : 'text-zinc-600 hover:text-blue-600'
                    }`}>
                      Key Concepts
                    </a>
                    <a href="#implementation" className={`block text-sm transition-colors duration-300 ${
                      isDark 
                        ? 'text-zinc-600 hover:text-blue-400' 
                        : 'text-zinc-600 hover:text-blue-600'
                    }`}>
                      Implementation
                    </a>
                    <a href="#best-practices" className={`block text-sm transition-colors duration-300 ${
                      isDark 
                        ? 'text-zinc-600 hover:text-blue-400' 
                        : 'text-zinc-600 hover:text-blue-600'
                    }`}>
                      Best Practices
                    </a>
                    <a href="#conclusion" className="block text-sm text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                      Conclusion
                    </a>
                  </nav>
                </CardContent>
              </Card>

                             {/* Article Stats */}
               <Card className={`bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] ${
                 isDark
                   ? 'hover:bg-black/40 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
                   : 'hover:bg-black/5 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
               }`}>
                 <CardContent className="p-6">
                  <h3 className="font-barlow font-extrabold mb-4 flex items-center gap-2 text-black dark:text-white">
                    <TrendingUp className="w-4 h-4" />
                    Article Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-sans text-black dark:text-white">Reading Time</span>
                      <span className="font-sans text-black dark:text-white">{post.readTime}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-sans text-black dark:text-white">Published</span>
                      <span className="font-sans text-black dark:text-white">{post.publishDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-black dark:text-white">Category</span>
                      <span className="font-sans text-black dark:text-white">{post.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

                             {/* Tags */}
               <Card className={`bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] ${
                 isDark
                   ? 'hover:bg-black/40 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
                   : 'hover:bg-black/5 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20'
               }`}>
                 <CardContent className="p-6">
                  <h3 className="font-barlow font-extrabold mb-4 flex items-center gap-2 text-black dark:text-white">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-zinc-200 dark:bg-white/10 text-black dark:text-white border-zinc-300 dark:border-white/20 hover:bg-zinc-300 dark:hover:bg-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="font-barlow font-extrabold text-3xl mb-8 text-black dark:text-white">Related Articles</h2>
          {relatedPosts.length === 0 ? (
            <div className="w-full max-w-[1700px] mx-auto flex items-center justify-center min-h-[200px]">
              <div className="bg-black border border-zinc-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center w-full">
                <h2 className="text-2xl font-extrabold mb-2 text-center text-white tracking-tight">No Related Blogs to Show</h2>
                <p className="text-zinc-400 text-lg text-center max-w-2xl mb-2">There are no other blog posts available at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost._id || relatedPost.id} href={`/blogs/${relatedPost._id || relatedPost.id}`}>
                  <Card className="bg-zinc-100 dark:bg-white/5 border-zinc-300 dark:border-white/10 backdrop-blur-md hover:bg-zinc-200 dark:hover:bg-white/10 transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/60 to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-barlow font-extrabold mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors text-black dark:text-white">
                        {relatedPost.title}
                      </h3>
                      <p className="font-sans text-black dark:text-white text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-gray-500">
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-zinc-200 dark:bg-white/10 backdrop-blur-md border border-zinc-300 dark:border-white/20 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-white/20 z-40"
          variant="ghost"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}
          <Footer />
        </main>
      </div>
    </div>
  );
}