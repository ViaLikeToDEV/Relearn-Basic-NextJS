'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Save, Zap, Cpu, Terminal } from 'lucide-react';

// --- Types ---
type ScheduleItem = {
  id: string;
  dayIndex: number;
  hour: number;
  title: string;
  room?: string;
  color: string;
};

type DayConfig = {
  id: number;
  name: string;
};

// --- Constants ---
const START_HOUR = 8;
const END_HOUR = 17;
const LUNCH_HOUR = 12;

// Cyberpunk Neon Palette
const COLORS = [
  'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]',
  'bg-fuchsia-500/10 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_10px_rgba(232,121,249,0.3)]',
  'bg-lime-500/10 border-lime-400 text-lime-300 shadow-[0_0_10px_rgba(163,230,53,0.3)]',
  'bg-violet-500/10 border-violet-400 text-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.3)]',
  'bg-yellow-500/10 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]',
  'bg-rose-500/10 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(251,113,133,0.3)]',
  'bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
  'bg-orange-500/10 border-orange-400 text-orange-300 shadow-[0_0_10px_rgba(251,146,60,0.3)]',
];

const DEFAULT_DAYS: DayConfig[] = [
  { id: 0, name: 'MON' },
  { id: 1, name: 'TUE' },
  { id: 2, name: 'WED' },
  { id: 3, name: 'THU' },
  { id: 4, name: 'FRI' },
];

// Mockup Data for cool visuals
const MOCKUP_DATA: ScheduleItem[] = [
  { id: '1', dayIndex: 0, hour: 9, title: 'CYBER SECURITY', room: 'LAB-01', color: COLORS[0] },
  { id: '2', dayIndex: 0, hour: 10, title: 'CYBER SECURITY', room: 'LAB-01', color: COLORS[0] },
  { id: '3', dayIndex: 1, hour: 13, title: 'AI ETHICS', room: 'SERVER-ROOM', color: COLORS[1] },
  { id: '4', dayIndex: 2, hour: 8, title: 'QUANTUM PHYS', room: 'VOID-HALL', color: COLORS[3] },
  { id: '5', dayIndex: 3, hour: 14, title: 'NETRUNNING 101', room: 'NET-SPACE', color: COLORS[5] },
  { id: '6', dayIndex: 4, hour: 15, title: 'ROBOTICS', room: 'MECH-BAY', color: COLORS[6] },
];

export default function ClassSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCKUP_DATA);
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [editItem, setEditItem] = useState<Partial<ScheduleItem>>({});

  const timeSlots = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const getItem = (dayIdx: number, hour: number) => {
    return schedule.find((item) => item.dayIndex === dayIdx && item.hour === hour);
  };

  const handleSlotClick = (dayIdx: number, hour: number) => {
    if (hour === LUNCH_HOUR) return;

    const existingItem = getItem(dayIdx, hour);
    setSelectedSlot({ day: dayIdx, hour });
    
    if (existingItem) {
      setEditItem(existingItem);
    } else {
      setEditItem({
        title: '',
        room: '',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        dayIndex: dayIdx,
        hour: hour,
      });
    }
  };

  const handleSave = () => {
    if (!selectedSlot || !editItem.title) return;

    setSchedule((prev) => {
      const filtered = prev.filter(
        (item) => !(item.dayIndex === selectedSlot.day && item.hour === selectedSlot.hour)
      );
      return [
        ...filtered,
        {
          id: editItem.id || crypto.randomUUID(),
          dayIndex: selectedSlot.day,
          hour: selectedSlot.hour,
          title: editItem.title!,
          room: editItem.room,
          color: editItem.color || COLORS[0],
        },
      ];
    });
    setSelectedSlot(null);
    setEditItem({});
  };

  const handleDelete = () => {
    if (!selectedSlot) return;
    setSchedule((prev) =>
      prev.filter((item) => !(item.dayIndex === selectedSlot.day && item.hour === selectedSlot.hour))
    );
    setSelectedSlot(null);
    setEditItem({});
  };

  const handleDayNameChange = (id: number, newName: string) => {
    setDays(days.map(d => d.id === id ? { ...d, name: newName } : d));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-mono text-cyan-50 selection:bg-cyan-500/30 selection:text-cyan-950 overflow-hidden relative">
      
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Header Controls */}
      <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            <Cpu className="text-cyan-400 w-8 h-8 animate-pulse"/> 
            NEURAL_SCHEDULE_V.2.0
          </h1>
          <p className="text-sm text-cyan-600/70 mt-1 font-bold tracking-widest">&gt;&gt; SYSTEM READY. WAITING FOR INPUT...</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setSchedule([])}
             className="px-6 py-2 text-xs font-bold tracking-widest text-red-400 border border-red-500/50 bg-red-950/30 hover:bg-red-900/50 rounded transition-all shadow-[0_0_10px_rgba(248,113,113,0.1)] hover:shadow-[0_0_15px_rgba(248,113,113,0.3)] uppercase"
           >
             [ Reset_System ]
           </button>
        </div>
      </div>

      {/* RGB Running Border Container */}
      <div className="relative z-10 group rounded-xl p-[2px] overflow-hidden">
        {/* The Animated RGB Gradient Layer */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,cyan_360deg)] animate-[spin_4s_linear_infinite] opacity-70"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent_0_340deg,fuchsia_360deg)] animate-[spin_4s_linear_infinite_reverse] opacity-70 mix-blend-screen"></div>

        {/* Inner Content */}
        <div className="relative w-full rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/5 overflow-x-auto pb-4">
          <div className="min-w-[1000px]">
            
            {/* Header Row (Time) */}
            <div className="grid border-b border-cyan-900/30 bg-slate-900/50" 
                style={{ gridTemplateColumns: `100px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
              
              <div className="p-4 font-bold text-cyan-600/50 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center border-r border-cyan-900/30">
                 T_ZONE
              </div>
              
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className={`p-3 text-center border-r border-cyan-900/30 last:border-r-0 flex flex-col justify-center relative
                    ${hour === LUNCH_HOUR ? 'bg-stripes-dark' : ''}
                  `}
                >
                  <span className="text-lg font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Day Rows */}
            {days.map((day) => (
              <div 
                key={day.id} 
                className="grid border-b border-cyan-900/30 last:border-b-0 hover:bg-cyan-900/5 transition-colors"
                style={{ gridTemplateColumns: `100px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}
              >
                {/* Day Name */}
                <div className="p-2 border-r border-cyan-900/30 flex items-center justify-center bg-slate-900/50 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyan-600/30"></div>
                  <input 
                    type="text" 
                    value={day.name}
                    onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                    className="w-full text-center font-bold text-slate-400 bg-transparent border-none focus:ring-0 uppercase tracking-widest text-sm focus:text-cyan-300 transition-colors"
                  />
                </div>

                {/* Slots */}
                {timeSlots.map((hour) => {
                  const item = getItem(day.id, hour);
                  const isLunch = hour === LUNCH_HOUR;

                  // Lunch Break (System Recharge)
                  if (isLunch) {
                    return (
                      <div key={hour} className="bg-slate-950/50 border-r border-cyan-900/30 flex items-center justify-center relative overflow-hidden group/lunch">
                         {/* Hazard Stripes */}
                         <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] [background-size:20px_20px]"></div>
                         <div className="relative z-10 flex flex-col items-center gap-1 opacity-50 group-hover/lunch:opacity-80 transition-opacity">
                            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-yellow-500 tracking-widest whitespace-nowrap -rotate-90">
                              RECHARGE
                            </span>
                         </div>
                      </div>
                    );
                  }

                  // Class Slot
                  return (
                    <div 
                      key={hour} 
                      onClick={() => handleSlotClick(day.id, hour)}
                      className="relative border-r border-cyan-900/30 h-32 p-1 group cursor-pointer"
                    >
                      {/* Grid Line Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-500/5 transition-opacity pointer-events-none"></div>

                      {item ? (
                        <div className={`h-full w-full rounded border backdrop-blur-sm p-3 flex flex-col justify-between transition-all hover:scale-[1.03] hover:brightness-110 relative overflow-hidden ${item.color}`}>
                          {/* Scanline overlay */}
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] [background-size:100%_4px] pointer-events-none opacity-20"></div>
                          
                          <div>
                            <div className="font-bold text-sm leading-tight line-clamp-2 tracking-wide drop-shadow-md">{item.title}</div>
                            {item.room && (
                              <div className="text-[10px] opacity-80 mt-2 flex items-center gap-1 font-bold">
                                <Terminal className="w-3 h-3" />
                                {item.room}
                              </div>
                            )}
                          </div>
                          <div className="text-[8px] opacity-60 font-bold text-right uppercase tracking-widest">:: EDIT ::</div>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="text-cyan-500/50 w-6 h-6 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal (Cyberpunk Style) */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedSlot(null)}>
          <div 
            className="w-full max-w-sm rounded-none bg-slate-900 border border-cyan-500/50 p-1 shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in zoom-in-95 duration-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Decor */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>

            <div className="bg-slate-900/90 p-6 border border-white/5 relative z-10">
              <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-6 bg-cyan-500 block animate-pulse"></span>
                  EDIT_NODE
                </h3>
                <button onClick={() => setSelectedSlot(null)} className="text-gray-500 hover:text-cyan-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-cyan-600 uppercase tracking-widest">&gt;&gt; Input_Subject</label>
                  <input
                    type="text"
                    autoFocus
                    className="w-full bg-slate-950 border border-gray-700 text-cyan-100 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-700 font-bold"
                    placeholder="ENTER_DATA..."
                    value={editItem.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-cyan-600 uppercase tracking-widest">&gt;&gt; Coordinates (Room)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-gray-700 text-cyan-100 px-4 py-3 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-700"
                    placeholder="LOC_ID..."
                    value={editItem.room || ''}
                    onChange={(e) => setEditItem({ ...editItem, room: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold text-cyan-600 uppercase tracking-widest">&gt;&gt; Tag_Color</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditItem({ ...editItem, color })}
                        className={`h-8 w-8 rounded border transition-all hover:scale-110 relative group ${
                           color.split(' ')[0] // extract bg color class
                        } ${editItem.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'border-white/20'}`}
                      >
                         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                   {getItem(selectedSlot.day, selectedSlot.hour) && (
                    <button
                      onClick={handleDelete}
                      className="flex flex-1 items-center justify-center gap-2 border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-900/40 hover:text-red-400 focus:outline-none uppercase tracking-widest transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="flex flex-[2] items-center justify-center gap-2 bg-cyan-600 px-4 py-3 text-xs font-bold text-white hover:bg-cyan-500 focus:outline-none shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] uppercase tracking-widest transition-all"
                  >
                    <Save className="w-4 h-4" /> Save_Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}