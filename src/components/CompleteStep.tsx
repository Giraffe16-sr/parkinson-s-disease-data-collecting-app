import { RecordingResult } from '../types';
import { CheckCircle2, Download, RefreshCcw, FileAudio } from 'lucide-react';
import { motion } from 'motion/react';

interface CompleteStepProps {
  recordings: Record<string, RecordingResult>;
  onReset: () => void;
}

export default function CompleteStep({ recordings, onReset }: CompleteStepProps) {
  const downloadAll = () => {
    Object.values(recordings).forEach((rec) => {
      const a = document.createElement('a');
      a.href = rec.url;
      a.download = rec.filename;
      a.click();
    });
  };

  const downloadFile = (rec: RecordingResult) => {
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = rec.filename;
    a.click();
  };

  return (
    <div className="medical-card p-8 md:p-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>

      <h2 className="text-3xl font-bold mb-4">검사가 완료되었습니다</h2>
      <p className="text-slate-500 mb-10">총 2개의 녹음 파일이 성공적으로 생성되었습니다.</p>

      <div className="space-y-4 mb-10 text-left">
        {Object.entries(recordings).map(([key, rec]) => (
          <div key={key} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                <FileAudio className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
                  {key === 'phonation' ? '지속 발성' : '텍스트 낭독'}
                </div>
                <div className="font-mono text-slate-700 font-medium">{rec.filename}</div>
              </div>
            </div>
            <button 
              onClick={() => downloadFile(rec)}
              className="p-3 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors border border-transparent hover:border-blue-100"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={onReset} className="btn-secondary py-5 flex items-center justify-center gap-2">
          <RefreshCcw className="w-5 h-5" /> 처음으로
        </button>
        <button onClick={downloadAll} className="btn-primary py-5 flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> 전체 파일 저장
        </button>
      </div>
    </div>
  );
}
