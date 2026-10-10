import React from 'react';
import {
  Layers,
  CalendarCheck,
  BellRing,
  Filter,
  BarChart3,
  LockKeyhole,
  CheckCircle2
} from 'lucide-react';

export function Features() {
  const features = [
    {
      title: 'Application Tracking & Kanban',
      description: 'Easily manage applications through interactive Kanban boards or high-density data tables with stage indicators.',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      title: 'Interview Scheduling & Prep',
      description: 'Schedule phone screens, technical loops, and system design rounds with direct meeting links and customized prep notes.',
      icon: CalendarCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      title: 'Deadline & OA Reminders',
      description: 'Keep track of tight online assessment deadlines and recruiter follow-ups before opportunities close.',
      icon: BellRing,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Instant Search & Multi-Filters',
      description: 'Filter applications in milliseconds by company, status, work mode (Remote/Hybrid/On-site), or custom priority tags.',
      icon: Filter,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      title: 'Conversion Funnel & Velocity Analytics',
      description: 'Gain insights into your interview conversion rates, offer percentages, and weekly submission velocity charts.',
      icon: BarChart3,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      title: 'Isolated Secure Personal Workspace',
      description: 'Multi-tenant database design ensuring strict data ownership isolation, HTTP-only cookie auth, and exportable JSON/CSV archives.',
      icon: LockKeyhole,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for engineering candidates who mean business
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Everything you need to navigate fast-paced hiring loops and secure your top-tier software engineering internship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-indigo-300 transition-all card-hover flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Production-ready backend API backed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
