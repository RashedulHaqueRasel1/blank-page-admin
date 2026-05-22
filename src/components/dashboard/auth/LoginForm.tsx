'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      // Force a hard refresh to the dashboard or callback to correctly initialize NextAuth middleware
      window.location.href = callbackUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden items-center justify-center">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-lg p-12 text-center flex flex-col items-center">
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
            <ShieldCheck className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
            Blank Page <span className="text-primary">AdminPro</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">
            The ultimate command center for your infrastructure. Monitor traffic, manage secure pages, and control user access with precision.
          </p>
          <div className="flex gap-4 items-center justify-center text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> End-to-End Secure</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Authorized Only</span>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
        {/* Subtle mobile background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden lg:hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col space-y-2 text-center mb-10 lg:hidden">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your admin account</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h2>
            <p className="text-muted-foreground mt-2 text-sm">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-3">
                <div className="mt-0.5"><Lock className="w-4 h-4" /></div>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@blankpage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-secondary/30 border-border/50 focus:bg-background transition-colors rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 bg-secondary/30 border-border/50 focus:bg-background transition-colors rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-md font-medium group relative overflow-hidden" disabled={isLoading}>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:animate-shimmer" />
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Protected by Blank Page Security System v2.1
          </div>
        </div>
      </div>
    </div>
  );
}
