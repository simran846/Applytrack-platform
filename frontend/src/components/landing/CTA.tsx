import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function CTA() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Your SDE Internship Hunt Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
          Your next opportunity deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">better organization.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
          Join ambitious computer science students using ApplyTrack to stay organized, ace interviews, and land dream roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Free Account
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700">
              Sign In to Existing Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
