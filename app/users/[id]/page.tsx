import React from 'react'

interface Props {
  params: Promise<{ id: string }> 
}

// สังเกตว่ารับ props ชื่อ params มา (Next.js ส่งมาให้เอง)
const UserDetailPage = async ({ params }: Props) => {
  // ดึง id ออกมา (ค่าจะเป็น string เสมอ เช่น "1", "5")
  const { id } = await params;

  // ยิงไปเอาข้อมูลเฉพาะคนนี้ โดยเอา id มาต่อท้าย URL
  // อย่าลืม Golden Rule: ต้อง await! และเช็ค error
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!res.ok) {
    throw new Error('Failed to fetch user details')
    }

  const user = await res.json();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
      <div className="border p-6 rounded-lg shadow-md max-w-md">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> {user.website}</p>
        <p><strong>Address:</strong> {user.address.street}</p>
      </div>
      
      {/* ปุ่มกดกลับ */}
      <a href="/users" className="mt-4 inline-block text-blue-500 hover:underline">
        ← Back to Users
      </a>
    </div>
  )
}

export default UserDetailPage