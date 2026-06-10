/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStep, PatientData, RecordingResult } from './types';
import PatientInput from './components/PatientInput';
import PhonationStep from './components/PhonationStep';
import ReadingStep from './components/ReadingStep';
import CompleteStep from './components/CompleteStep';
import Header from './components/Header';
import InstallPrompt from './components/InstallPrompt';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INFO);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [recordings, setRecordings] = useState<Record<string, RecordingResult>>({});

  const startTest = (data: PatientData) => {
    setPatientData(data);
    setStep(AppStep.PHONATION);
  };

  const handleRecordingComplete = (key: string, result: RecordingResult) => {
    setRecordings(prev => ({ ...prev, [key]: result }));
  };

  const nextStep = () => {
    if (step === AppStep.PHONATION) setStep(AppStep.READING);
    else if (step === AppStep.READING) setStep(AppStep.COMPLETE);
  };

  const reset = () => {
    setStep(AppStep.INFO);
    setPatientData(null);
    setRecordings({});
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-4 md:p-8">
      <Header step={step} patientId={patientData?.id} />

      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === AppStep.INFO && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PatientInput onStart={startTest} />
            </motion.div>
          )}

          {step === AppStep.PHONATION && patientData && (
            <motion.div
              key="phonation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PhonationStep 
                patientData={patientData} 
                onComplete={(res) => {
                  handleRecordingComplete('phonation', res);
                  nextStep();
                }}
              />
            </motion.div>
          )}

          {step === AppStep.READING && patientData && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReadingStep 
                patientData={patientData} 
                onComplete={(res) => {
                  handleRecordingComplete('reading', res);
                  nextStep();
                }}
              />
            </motion.div>
          )}

          {step === AppStep.COMPLETE && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CompleteStep 
                recordings={recordings} 
                onReset={reset} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; 2026 Parkinson Voice Diagnostic Tool
      </footer>

      {/* Floating PWA Install Prompter */}
      <InstallPrompt />
    </div>
  );
}

