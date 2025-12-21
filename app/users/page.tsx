import React from 'react'
// 1. แก้ import ให้ถูก (I ใหญ่)
import Link from 'next/link' 

interface User {
  id: number
  name: string
  email: string // เพิ่ม field ให้ดูมีอะไรหน่อย
}

const UsersPage = async () => {
  // 2. ใช้ Pattern กันตายที่คุยกันไว้
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store' // 3. แถม: ถ้าอยากได้ข้อมูลสดใหม่ทุกครั้งให้ใส่ options นี้ (Optional)
  });

  if (!res.ok) {
    // ใน Next.js ถ้า throw error ในนี้ มันจะไปเรียก error.tsx ให้เอง
    throw new Error('Failed to fetch users')
  }

  const users: User[] = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <ul className="space-y-2">
        {/* 4. วนลูปแสดงข้อมูล */}
        {users.map((user) => (
          <li key={user.id} className="p-4 border rounded hover:bg-gray-100 transition">
             {/* ใส่ Link ให้กดไปต่อได้ */}
            <Link href={`/users/${user.id}`} className="flex justify-between items-center">
                <span>{user.name}</span>
                <span className="text-gray-500 text-sm">{user.email}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersPage