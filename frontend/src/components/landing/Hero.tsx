'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Building2, Calendar, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative background grid & glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Engineered for SDE & Tech Job Seekers</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Every application. One clear path to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">next opportunity.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
                Track internships, organize interviews, manage deadlines, and turn your job search into a clear, actionable plan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-md shadow-indigo-600/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Tracking Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Demo Workspace
                </Button>
              </Link>
            </div>

            {/* Value bullets */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero spreadsheet chaos</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Real-time conversion metrics</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Interview agenda calendar</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Product Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-slate-900/10 backdrop-blur-xl shadow-2xl">
              <div className="rounded-xl bg-white p-5 border border-slate-200/80 space-y-4 shadow-sm">
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-medium text-slate-400 ml-2">app.applytrack.dev</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Demo Workspace
                  </span>
                </div>

                {/* Mockup Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-medium text-slate-500">Applied</p>
                    <p className="text-xl font-bold text-slate-900">42</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">+6 this week</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <p className="text-[11px] font-medium text-indigo-700">Interviews</p>
                    <p className="text-xl font-bold text-indigo-950">5</p>
                    <span className="text-[10px] text-indigo-600 font-semibold">12% rate</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <p className="text-[11px] font-medium text-emerald-700">Offers</p>
                    <p className="text-xl font-bold text-emerald-950">2</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Summer 2027</span>
                  </div>
                </div>

                {/* Mockup Application Items */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Applications</p>
                  
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-xs">
                        G
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Google</h4>
                        <p className="text-[11px] text-slate-500">SWE Intern • Mountain View, CA</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Technical Round 1
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                        S
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Stripe</h4>
                        <p className="text-[11px] text-slate-500">Backend Engineering Intern • Remote</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      System Design
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-subtle hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-xs">
                        A
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Amazon</h4>
                        <p className="text-[11px] text-slate-500">SDE Intern • Seattle, WA</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Offer Received ($56/hr)
                    </span>
                  </div>
                </div>

                {/* Micro preview footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Next Interview: Thursday @ 2:00 PM EST</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
