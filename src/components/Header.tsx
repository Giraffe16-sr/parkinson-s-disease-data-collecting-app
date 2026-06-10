import { AppStep } from '../types';
import { Activity } from 'lucide-react';

interface HeaderProps {
  step: AppStep;
  patientId?: string;
}

export default function Header({ step, patientId }: HeaderProps) {
  return (
    <header className="py-6 flex items-center justify-between border-b border-slate-100 mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">Parkinson Voice</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Diagnostic Tool</p>
        </div>
      </div>
      
      <div className="text-right">
        {patientId && (
          <div className="text-sm font-medium text-slate-600">
            Patient: <span className="text-blue-600 font-bold">{patientId}</span>
          </div>
        )}
        <div className="text-[10px] text-slate-400 font-mono uppercase">
          {new Date().toISOString().split('T')[0].replace(/-/g, '')}
        </div>
      </div>
    </header>
  );
}
