import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Volume2 } from 'lucide-react';
import { VoiceNote } from '../types';

interface VoiceNoteRecorderProps {
  moduleId: string;
  onSave: (note: VoiceNote) => void;
  notes: VoiceNote[];
  onDelete: (id: string) => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ moduleId, onSave, notes, onDelete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newNote: VoiceNote = {
          id: Math.random().toString(36).substr(2, 9),
          moduleId,
          timestamp: new Date().toLocaleString(),
          audioUrl: url,
          duration: formatTime(recordingTime),
        };
        onSave(newNote);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 pt-8 border-t border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-500" />
          <h4 className="text-sm font-bold uppercase tracking-widest font-mono">Module Voice Notes</h4>
        </div>
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            <Mic className="w-4 h-4" /> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold transition-all animate-pulse"
          >
            <Square className="w-4 h-4" /> Stop ({formatTime(recordingTime)})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notes.filter(n => n.moduleId === moduleId).map((note) => (
          <div key={note.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Play className="w-3 h-3 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 font-mono uppercase">{note.timestamp}</p>
                <p className="text-xs font-bold text-white/80">Voice Note - {note.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <audio src={note.audioUrl} controls className="h-8 w-48 brightness-90 contrast-125" />
              <button
                onClick={() => onDelete(note.id)}
                className="p-2 text-white/20 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {notes.filter(n => n.moduleId === moduleId).length === 0 && !isRecording && (
          <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
            <p className="text-[10px] text-white/20 uppercase font-mono">No voice notes for this module</p>
          </div>
        )}
      </div>
    </div>
  );
};
