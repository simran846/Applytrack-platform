import React from 'react';
import { Target, Award, Clock, ArrowUpRight } from 'lucide-react';

export function Metrics() {
  const metrics = [
    {
      label: 'Target Applications',
      value: '50-100+',
      description: 'Optimal application volume tracked per recruitment season',
      icon: Target,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      label: 'Avg. Interview Rate',
      value: '14.8%',
      description: 'Typical conversion from tailored cold apply to phone screen',
      icon: ArrowUpRight,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      label: 'Time Saved Weekly',
      value: '4.5 hrs',
      description: 'Eliminating manual spreadsheet entry & calendar cross-checking',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      label: 'Offer Closure Rate',
      value: '35%+',
      description: 'Higher final offer rate with structured prep notes & tracking',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Industry Benchmarks</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Built to maximize your internship search conversion
          </h2>
          <p className="text-xs text-slate-500 mt-1 italic">
            *Illustrative demo metrics designed around competitive software engineering recruiting cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-indigo-200 transition-all card-hover"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
                <div className="text-sm font-bold text-slate-700 mt-1">{m.label}</div>
                <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
