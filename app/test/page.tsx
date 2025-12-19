'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Save, Clock, GripVertical } from 'lucide-react';

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
const END_HOUR = 17; // ถึง 5 โมงเย็น
const LUNCH_HOUR = 12; // พักเที่ยงตอนเที่ยง

const COLORS = [
  'bg-red-200 border-red-400 text-red-800',
  'bg-orange-200 border-orange-400 text-orange-800',
  'bg-amber-200 border-amber-400 text-amber-800',
  'bg-green-200 border-green-400 text-green-800',
  'bg-emerald-200 border-emerald-400 text-emerald-800',
  'bg-teal-200 border-teal-400 text-teal-800',
  'bg-cyan-200 border-cyan-400 text-cyan-800',
  'bg-blue-200 border-blue-400 text-blue-800',
  'bg-indigo-200 border-indigo-400 text-indigo-800',
  'bg-violet-200 border-violet-400 text-violet-800',
  'bg-purple-200 border-purple-400 text-purple-800',
  'bg-fuchsia-200 border-fuchsia-400 text-fuchsia-800',
  'bg-pink-200 border-pink-400 text-pink-800',
  'bg-rose-200 border-rose-400 text-rose-800',
  'bg-gray-200 border-gray-400 text-gray-800',
];

const DEFAULT_DAYS: DayConfig[] = [
  { id: 0, name: 'จันทร์' },
  { id: 1, name: 'อังคาร' },
  { id: 2, name: 'พุธ' },
  { id: 3, name: 'พฤหัสบดี' },
  { id: 4, name: 'ศุกร์' },
];

export default function ClassSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [days, setDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [editItem, setEditItem] = useState<Partial<ScheduleItem>>({});

  // สร้างช่วงเวลา (Columns)
  const timeSlots = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  // หา Item ใน Slot นั้นๆ
  const getItem = (dayIdx: number, hour: number) => {
    return schedule.find((item) => item.dayIndex === dayIdx && item.hour === hour);
  };

  // เปิด Modal แก้ไข/เพิ่ม
  const handleSlotClick = (dayIdx: number, hour: number) => {
    if (hour === LUNCH_HOUR) return; // ห้ามยุ่งกับเวลาพักเที่ยง

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
      // ลบอันเก่าออกก่อน (ถ้ามี) แล้วใส่ new item
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

  // ฟังก์ชันแก้ชื่อวัน
  const handleDayNameChange = (id: number, newName: string) => {
    setDays(days.map(d => d.id === id ? { ...d, name: newName } : d));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      
      {/* Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GripVertical className="text-indigo-600"/> 
            ตารางเรียน
          </h1>
          <p className="text-sm text-gray-500">คลิกในช่องเวลาใดก็ได้เพื่อเพิ่มหรือแก้ไขวิชาเรียน</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setSchedule([])}
             className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
           >
             ลบทั้งหมด
           </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1000px] rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Header Row (Time) */}
          <div className="grid border-b border-gray-200 bg-gray-50" 
               style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}>
            
            <div className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider flex items-center justify-center border-r border-gray-200">
               วัน / เวลา
            </div>
            
            {timeSlots.map((hour) => (
              <div 
                key={hour} 
                className={`p-3 text-center border-r border-gray-100 last:border-r-0 flex flex-col justify-center
                  ${hour === LUNCH_HOUR ? 'bg-stripes-gray' : ''}
                `}
              >
                <span className="text-lg font-bold text-gray-700">{hour}:00</span>
                <span className="text-xs text-gray-400">{hour + 1}:00</span>
              </div>
            ))}
          </div>

          {/* Day Rows */}
          {days.map((day) => (
            <div 
              key={day.id} 
              className="grid border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
              style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, minmax(100px, 1fr))` }}
            >
              {/* Day Name Column */}
              <div className="p-2 border-r border-gray-200 flex items-center justify-center bg-white z-10">
                <input 
                  type="text" 
                  value={day.name}
                  onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                  className="w-full text-center font-bold text-gray-700 bg-transparent border-none focus:ring-0 uppercase tracking-wide"
                />
              </div>

              {/* Time Slots */}
              {timeSlots.map((hour) => {
                const item = getItem(day.id, hour);
                const isLunch = hour === LUNCH_HOUR;

                // Lunch Break Column
                if (isLunch) {
                  return (
                    <div key={hour} className="bg-gray-100 border-r border-gray-100 flex items-center justify-center relative overflow-hidden">
                       {/* Pattern for Lunch */}
                       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]"></div>
                       <span className="relative z-10 -rotate-90 text-xs font-bold text-gray-400 tracking-[0.2em] whitespace-nowrap">
                         พักเที่ยง
                       </span>
                    </div>
                  );
                }

                // Class Slot
                return (
                  <div 
                    key={hour} 
                    onClick={() => handleSlotClick(day.id, hour)}
                    className="relative border-r border-gray-100 h-28 p-1 group cursor-pointer transition-all hover:bg-indigo-50/30"
                  >
                    {item ? (
                      <div className={`h-full w-full rounded-lg p-2 shadow-sm border ${item.color} flex flex-col justify-between transition-transform hover:scale-[1.02]`}>
                        <div>
                          <div className="font-bold leading-tight line-clamp-2">{item.title}</div>
                          {item.room && (
                            <div className="text-xs opacity-75 mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                              {item.room}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] opacity-60 font-medium text-right uppercase tracking-wider">แก้ไข</div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="text-indigo-300 w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>

      {/* Edit Modal (Simple Overlay) */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedSlot(null)}>
          <div 
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                แก้ไขช่วงเวลา ({days[selectedSlot.day].name} {selectedSlot.hour}:00)
              </h3>
              <button onClick={() => setSelectedSlot(null)} className="rounded-full p-1 hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">วิชาเรียน / ชื่องาน</label>
                <input
                  type="text"
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="เช่น คณิตศาสตร์"
                  value={editItem.title || ''}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">ห้องเรียน / สถานที่ (ไม่บังคับ)</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="เช่น อาคาร 4 ห้อง 202"
                  value={editItem.room || ''}
                  onChange={(e) => setEditItem({ ...editItem, room: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">สีป้าย</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditItem({ ...editItem, color })}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${color} ${
                        editItem.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                 {getItem(selectedSlot.day, selectedSlot.hour) && (
                  <button
                    onClick={handleDelete}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4" /> ลบ
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Save className="w-4 h-4" /> บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
