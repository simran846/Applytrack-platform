import React from 'react';
import { PlusCircle, GitMerge, CheckSquare } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Record & Organize Applications',
      description: 'Log company details, job descriptions, compensation, and active posting URLs in seconds with our quick-add interface.',
      icon: PlusCircle,
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      step: '02',
      title: 'Track Through Every Hiring Stage',
      description: 'Move applications effortlessly across Wishlist, Applied, Online Assessment, Technical Screen, and Final Round loops.',
      icon: GitMerge,
      accent: 'from-indigo-600 to-purple-600'
    },
    {
      step: '03',
      title: 'Ace Interviews & Evaluate Offers',
      description: 'Keep your interview calendar synced, document feedback immediately after rounds, and compare total compensation packages.',
      icon: CheckSquare,
      accent: 'from-purple-600 to-emerald-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How ApplyTrack streamlines your recruitment journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From first cold outreach to your signed offer letter, stay focused on what matters most: interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-indigo-200 transition-all card-hover"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.accent} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-300 font-mono">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
