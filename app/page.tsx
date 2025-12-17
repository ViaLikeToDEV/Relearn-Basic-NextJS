'use client';
import Image from "next/image";
import { useState } from 'react';


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {/* เช็ค State: ถ้าเปิดอยู่โชว์คำว่า Close ถ้าปิดโชว์ Open */}
        {isOpen ? 'Close Modal' : 'Open Modal'}
      </button>
      {isOpen && (
        <div className="modal">
          <h2>ผ่ามมม!! โผล่มาแล้ว</h2>
        </div>
      )}
      </div>
  );
}
