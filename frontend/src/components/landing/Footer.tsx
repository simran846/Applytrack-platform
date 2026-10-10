import React from 'react';
import Link from 'next/link';
import { Briefcase, Github, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Apply<span className="text-indigo-600">Track</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              The modern internship & job application tracking platform built for aspiring Software Engineers.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
              >
                <Github className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Production SDE Architecture
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Interactive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Kanban Board
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Interview Agenda
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Conversion Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Next.js 15 & React 19</li>
              <li>Node.js / Express REST API</li>
              <li>MySQL & Prisma ORM</li>
              <li>Redis & BullMQ Job Queue</li>
              <li>Docker & AWS Ready</li>
            </ul>
          </div>

          {/* Col 4: Legal / Docs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                  Swagger OpenAPI Docs
                </a>
              </li>
              <li>
                <span className="cursor-pointer hover:text-indigo-600 transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-indigo-600 transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">© 2026 ApplyTrack. All rights reserved.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>Designed and engineered for Software Development Engineer (SDE) portfolio showcase.</p>
          <p className="mt-2 sm:mt-0 font-medium text-slate-600">Tagline: &quot;Your career journey, organized.&quot;</p>
        </div>
      </div>
    </footer>
  );
}
