"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { theme } = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Missing token.');
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch('/api/newsletter/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while processing your request.');
      }
    };

    unsubscribe();
  }, [token]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-md w-full space-y-8">
        <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {status === 'loading' && 'Processing...'}
              {status === 'success' && 'Unsubscribed Successfully'}
              {status === 'error' && 'Error'}
            </CardTitle>
            <CardDescription className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {status === 'loading' && 'Please wait while we process your request...'}
              {status === 'success' && 'You have been successfully unsubscribed from our newsletter.'}
              {status === 'error' && 'There was an issue processing your request.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'loading' && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="text-green-500 text-6xl">✓</div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {message}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  We're sorry to see you go! If you change your mind, you can always resubscribe later.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <div className="text-red-500 text-6xl">✗</div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {message}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <Link href="/">
                <Button 
                  className={`w-full ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  Return to Homepage
                </Button>
              </Link>
              
              {status === 'success' && (
                <Link href="/newsletter">
                  <Button 
                    variant="outline" 
                    className={`w-full ${isDark ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}
                  >
                    Resubscribe
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 