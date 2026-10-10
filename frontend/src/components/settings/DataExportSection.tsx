'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { applicationsApi } from '@/lib/api';
import { useToast } from '../ui/Toast';
import { Download, FileJson, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export function DataExportSection() {
  const { success, error: toastError } = useToast();
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  const handleExportJson = async () => {
    try {
      setIsExportingJson(true);
      const res = await applicationsApi.exportData();
      const data = res.data.data;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applytrack_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success('JSON Exported', 'Downloaded full workspace JSON archive.');
    } catch (err: any) {
      toastError('Export Failed', 'Unable to export workspace data.');
    } finally {
      setIsExportingJson(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExportingCsv(true);
      const res = await applicationsApi.exportData();
      const items = res.data.data;

      if (!items || items.length === 0) {
        toastError('No Data', 'You have no applications to export.');
        return;
      }

      const headers = ['Company', 'Job Title', 'Status', 'Work Mode', 'Priority', 'Salary', 'Application Date', 'Deadline', 'Location', 'Notes'];
      const rows = items.map((app) => [
        `"${app.companyName.replace(/"/g, '""')}"`,
        `"${app.jobTitle.replace(/"/g, '""')}"`,
        app.status,
        app.workMode,
        app.priority,
        `"${(app.salaryOrStipend || '').replace(/"/g, '""')}"`,
        app.applicationDate ? new Date(app.applicationDate).toISOString().split('T')[0] : '',
        app.applicationDeadline ? new Date(app.applicationDeadline).toISOString().split('T')[0] : '',
        `"${(app.location || '').replace(/"/g, '""')}"`,
        `"${(app.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applytrack_applications_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success('CSV Exported', 'Downloaded applications spreadsheet.');
    } catch (err: any) {
      toastError('Export Failed', 'Unable to generate CSV.');
    } finally {
      setIsExportingCsv(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Data Ownership & Export</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Download your complete application history and interview logs at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">JSON Archive</h4>
              <p className="text-[11px] text-slate-500">Includes raw nested interviews and activity metadata</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            isLoading={isExportingJson}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">CSV Spreadsheet</h4>
              <p className="text-[11px] text-slate-500">Formatted for Excel, Google Sheets, or Notion</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            isLoading={isExportingCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Your data is strictly isolated to your account ID and never shared.</span>
      </div>
    </div>
  );
}
