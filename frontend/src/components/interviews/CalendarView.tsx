'use client';

import React, { useState } from 'react';
import { Interview } from '@/types';
import { formatDateTime } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  Building2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface CalendarViewProps {
  interviews: Interview[];
  onSelectInterview: (interview: Interview) => void;
  onScheduleNew: () => void;
}

export function CalendarView({
  interviews,
  onSelectInterview,
  onScheduleNew
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Map interviews by day of month
  const interviewsByDay: Record<number, Interview[]> = {};
  interviews.forEach((iv) => {
    const ivDate = new Date(iv.interviewDate);
    if (ivDate.getFullYear() === year && ivDate.getMonth() === month) {
      const day = ivDate.getDate();
      if (!interviewsByDay[day]) interviewsByDay[day] = [];
      interviewsByDay[day].push(iv);
    }
  });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{monthLabel}</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" onClick={onScheduleNew}>
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {d}
          </div>
        ))}

        {/* Blank days from previous month */}
        {blankDays.map((_, idx) => (
          <div key={`blank-${idx}`} className="bg-slate-50/50 min-h-[90px] p-2" />
        ))}

        {/* Days of current month */}
        {daysArray.map((day) => {
          const dayInterviews = interviewsByDay[day] || [];
          const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day;

          return (
            <div
              key={day}
              className={`bg-white min-h-[90px] p-2 flex flex-col justify-between transition-colors hover:bg-indigo-50/20 ${
                isToday ? 'ring-2 ring-indigo-500 inset-0' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
                  }`}
                >
                  {day}
                </span>
                {dayInterviews.length > 0 && (
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                    {dayInterviews.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 mt-1">
                {dayInterviews.map((iv) => (
                  <button
                    key={iv.id}
                    onClick={() => onSelectInterview(iv)}
                    className="w-full text-left p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-[10px] font-semibold text-indigo-900 truncate transition-colors block"
                  >
                    {iv.application?.companyName || 'Target'}: {iv.interviewRound}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
