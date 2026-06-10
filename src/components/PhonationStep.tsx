import { useState, useEffect } from 'react';
import { PatientData, RecordingResult } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, Square, CheckCircle, RefreshCcw, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface PhonationStepProps {
  patientData: PatientData;
  onComplete: (result: RecordingResult) => void;
}

export default function PhonationStep({ patientData, onComplete }: PhonationStepProps) {
  const { isRecording, duration, audioURL, startRecording, stopRecording } = useAudioRecorder();
  const [hasRecorded, setHasRecorded] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  const RECORDING_LIMIT = 5;

  useEffect(() => {
    if (isRecording && duration >= RECORDING_LIMIT) {
      handleStop();
    }
  }, [duration, isRecording]);

  const handleStart = () => {
    startRecording();
    setHasRecorded(false);
  };

  const handleStop = async () => {
    const recordedBlob = await stopRecording();
    if (recordedBlob) {
      setBlob(recordedBlob);
      setHasRecorded(true);
    }
  };

  const handleNext = () => {
    if (blob) {
      const filename = `${patientData.id}_${patientData.date}_01.wav`;
      const url = URL.createObjectURL(blob);
      onComplete({ blob, filename, url });
    }
  };

  return (
    <div className="medical-card p-8 md:p-12 text-center">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4">지속 발성 ('아~')</h2>
        <p className="text-slate-500 text-lg">
          숨을 크게 들이마신 후, <span className="text-blue-600 font-bold">5초간</span> 일정한 톤으로 <br />
          '아' 소리를 내주세요.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Progress Ring */}
          <svg className="w-48 h-48 -rotate-90">
            <circle
              cx="96" cy="96" r="88"
              fill="none" stroke="currentColor"
              className="text-slate-100"
              strokeWidth="8"
            />
            {isRecording && (
              <motion.circle
                cx="96" cy="96" r="88"
                fill="none" stroke="currentColor"
                className="text-blue-500"
                strokeWidth="8"
                strokeDasharray="553"
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * duration) / RECORDING_LIMIT }}
                transition={{ duration: 0.5, ease: "linear" }}
                strokeLinecap="round"
              />
            )}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-mono font-bold text-slate-800">
              {isRecording ? duration : (hasRecorded ? RECORDING_LIMIT : 0)}
              <span className="text-sm text-slate-400 font-sans ml-1">/ {RECORDING_LIMIT}s</span>
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
              {isRecording ? "Recording..." : "Ready"}
            </span>
          </div>
        </div>

        {!isRecording && !hasRecorded && (
          <button onClick={handleStart} className="btn-primary w-full max-w-xs py-5 flex items-center justify-center gap-2 text-lg">
            <Mic className="w-6 h-6" /> 녹음 시작
          </button>
        )}

        {isRecording && (
          <button onClick={handleStop} className="bg-red-500 text-white w-full max-w-xs py-5 rounded-full font-medium flex items-center justify-center gap-2 text-lg animate-pulse">
            <Square className="w-6 h-6 fill-current" /> 중지
          </button>
        )}

        {hasRecorded && audioURL && (
          <div className="w-full space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <audio src={audioURL} controls className="flex-1 h-10" />
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleStart} className="flex-1 btn-secondary py-5 flex items-center justify-center gap-2">
                <RefreshCcw className="w-5 h-5" /> 다시 녹음
              </button>
              <button onClick={handleNext} className="flex-1 btn-primary py-5 flex items-center justify-center gap-2">
                다음 단계 <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
