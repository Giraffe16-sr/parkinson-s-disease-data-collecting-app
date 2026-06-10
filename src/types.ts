export interface PatientData {
  id: string;
  date: string; // YYYYMMDD
}

export enum AppStep {
  INFO = 'info',
  PHONATION = 'phonation',
  READING = 'reading',
  COMPLETE = 'complete'
}

export interface RecordingResult {
  blob: Blob;
  filename: string;
  url: string;
}
