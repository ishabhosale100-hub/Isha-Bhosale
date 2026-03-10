import React from 'react';
import { TimelineEvent } from '../types';
import { Clock, MapPin, AlertTriangle, FileText, User } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Incident': return AlertTriangle;
      case 'Evidence': return FileText;
      case 'Lead': return User;
      default: return Clock;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'Incident': return 'text-red-400 bg-red-400/10';
      case 'Evidence': return 'text-orange-400 bg-orange-400/10';
      case 'Lead': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-px before:bg-white/10">
      {events.map((event, index) => {
        const Icon = getIcon(event.type);
        return (
          <div key={index} className="relative pl-12">
            <div className={`absolute left-0 top-0 p-2 rounded-lg z-10 ${getColor(event.type)}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white">{event.title}</h4>
                <span className="text-[10px] font-mono text-white/40 uppercase">{event.date} • {event.time}</span>
              </div>
              <p className="text-sm text-white/60">{event.description}</p>
            </div>
          </div>
        );
      })}
      {events.length === 0 && (
        <div className="text-center py-12 text-white/20">
          No timeline events recorded.
        </div>
      )}
    </div>
  );
};
