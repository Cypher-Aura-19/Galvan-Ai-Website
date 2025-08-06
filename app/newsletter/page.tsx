"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle, Mail, Users, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={`w-full font-semibold py-4 rounded-lg border font-barlow text-lg ${
        isDark 
          ? "bg-white text-black hover:bg-white/90 border-white" 
          : "bg-black text-white hover:bg-black/90 border-black"
      }`}
    >
      {pending ? "Subscribing..." : "Join Our Newsletter"}
    </Button>
  );
}

export default function NewsletterPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [state, formAction] = useFormState(subscribeToNewsletter, null);

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Insights",
      description: "Stay ahead with the latest AI trends and breakthroughs"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Community",
      description: "Join thousands of AI enthusiasts and professionals"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Tips",
      description: "Get actionable strategies to scale your AI initiatives"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Weekly Updates",
      description: "Curated content delivered to your inbox every week"
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-barlow mb-6">
              Stay Ahead with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI Innovation</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Join our exclusive newsletter and get the latest insights, trends, and breakthroughs in artificial intelligence delivered straight to your inbox.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Subscribe?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get exclusive access to cutting-edge AI insights, expert analysis, and actionable strategies that will help you stay competitive in the rapidly evolving AI landscape.
              </p>
            </div>

            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-lg border ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className="font-semibold mb-2">What you'll receive:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Weekly AI industry insights and trends
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Exclusive case studies and success stories
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Early access to new features and updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Invitations to webinars and events
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Subscription Form */}
          <div className="lg:pl-8">
            <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-xl`}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Join Our Newsletter</CardTitle>
                <CardDescription className="text-lg">
                  Get started with AI innovation today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      className={`${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                    />
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      className={`${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className={`${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                  />
                  <input type="hidden" name="source" value="newsletter-page" />
                  <SubmitButton />
                </form>

                {state && (
                  <div className={`p-4 rounded-lg text-center ${
                    state.success 
                      ? (isDark ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-green-50 border border-green-200 text-green-700')
                      : (isDark ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700')
                  }`}>
                    {state.message}
                  </div>
                )}

                <div className="text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    By subscribing, you agree to our{' '}
                    <Link href="#" className="underline hover:no-underline">
                      Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="#" className="underline hover:no-underline">
                      Terms of Service
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business with AI?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who are already leveraging AI to drive innovation and growth.
          </p>
          <Link href="/contact">
            <Button 
              size="lg"
              className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 