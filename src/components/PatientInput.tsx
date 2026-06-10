import { useState, FormEvent } from 'react';
import { PatientData } from '../types';
import { User, Calendar, ArrowRight } from 'lucide-react';

interface PatientInputProps {
  onStart: (data: PatientData) => void;
}

export default function PatientInput({ onStart }: PatientInputProps) {
  const [id, setId] = useState('');
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      onStart({ id: id.trim(), date: today });
    }
  };

  return (
    <div className="medical-card p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">환자 정보 입력</h2>
        <p className="text-slate-500">진단 테스트를 시작하기 위해 환자 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">환자 ID</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="예: P-12345"
              className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">검사 날짜 (자동)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              disabled
              value={today}
              className="w-full bg-slate-100 border-0 rounded-2xl py-4 pl-12 pr-4 text-lg text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button type="submit" className="w-full btn-primary py-5 flex items-center justify-center gap-2 text-lg">
          테스트 시작 <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
