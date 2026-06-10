import { useState, useRef } from 'react';
import { PatientData, RecordingResult } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, Square, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface ReadingStepProps {
  patientData: PatientData;
  onComplete: (result: RecordingResult) => void;
}

const READING_PASSAGE = [
  "아래 문장을 천천히, 크고 정확하게 읽어주세요.",
  "우리나라의 가을은 참으로 아름답다.",
  "무엇보다도 산에 오를 땐 더욱 더 그 빼어난 아름다움이 느껴진다.",
  "쓰다듬어진 듯한 완만함과 깎아 놓은 듯한 뾰족함이 어우러진 산등성이를 따라 오르다 보면 절로 감탄을 금할 수가 없게 된다.",
  "붉은색, 푸른색, 노란색 등의 여러 가지 색깔이 어우러져 타는 듯한 감동을 주며 나아가 신비롭기까지 하다.",
  "숲 속에 누워서 하늘을 바라보라.",
  "쌍쌍이 짝지어 잇는 듯한 흰 구름, 높고 파란 하늘을 쳐다보고 있노라면 과연 옛부터 가을을 천고마비의 계절이라 일컫는 이유를 알게 될 것만 같다."
];

export default function ReadingStep({ patientData, onComplete }: ReadingStepProps) {
  const { isRecording, duration, audioURL, startRecording, stopRecording } = useAudioRecorder();
  const [hasRecorded, setHasRecorded] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [currentLine, setCurrentLine] = useState(0);

  const handleStart = () => {
    startRecording();
    setHasRecorded(false);
    setCurrentLine(1); // Start from first real sentence
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
      const filename = `${patientData.id}_${patientData.date}_02.wav`;
      const url = URL.createObjectURL(blob);
      onComplete({ blob, filename, url });
    }
  };

  return (
    <div className="medical-card p-6 md:p-10 flex flex-col h-[70vh]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-1">텍스트 낭독</h2>
          <p className="text-slate-500 text-sm">제시된 문장을 소리 내어 읽어주세요.</p>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full animate-pulse">
            <Mic className="w-4 h-4 fill-current" />
            <span className="font-mono font-bold">{duration}s</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-8 custom-scrollbar">
        <div className="space-y-4">
          {READING_PASSAGE.map((text, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{ 
                opacity: idx === 0 ? 0.4 : (currentLine === idx ? 1 : 0.3),
                scale: currentLine === idx ? 1.02 : 1,
                x: currentLine === idx ? 8 : 0
              }}
              className={`reading-text transition-all ${idx === 0 ? 'text-sm font-bold uppercase tracking-wider mb-8 text-blue-600' : ''} ${currentLine === idx ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => isRecording && setCurrentLine(idx)}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {!isRecording && !hasRecorded && (
          <button onClick={handleStart} className="flex-1 btn-primary py-5 flex items-center justify-center gap-2 text-lg">
            <Mic className="w-6 h-6" /> 녹음 시작
          </button>
        )}

        {isRecording && (
          <>
            <button 
              onClick={() => setCurrentLine(prev => Math.min(prev + 1, READING_PASSAGE.length - 1))} 
              className="flex-1 btn-secondary py-5 flex items-center justify-center gap-2"
            >
              다음 문장
            </button>
            <button onClick={handleStop} className="flex-1 bg-red-500 text-white py-5 rounded-full font-medium flex items-center justify-center gap-2 text-lg">
              <Square className="w-6 h-6 fill-current" /> 녹음 종료
            </button>
          </>
        )}

        {hasRecorded && audioURL && (
          <div className="w-full space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <audio src={audioURL} controls className="flex-1 h-10" />
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleStart} className="flex-1 btn-secondary py-5 flex items-center justify-center gap-2">
                <RefreshCcw className="w-5 h-5" /> 다시 녹음
              </button>
              <button onClick={handleNext} className="flex-1 btn-primary py-5 flex items-center justify-center gap-2">
                테스트 완료 <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
