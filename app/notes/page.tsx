import { getServerSupabase } from '@/lib/supabase'

export default async function Notes() {
  // إنشاء عميل Supabase
  const supabase = getServerSupabase()
  
  // استعلام البيانات من جدول notes
  const { data: notes } = await supabase.from("notes").select()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">الملاحظات</h1>
      <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(notes, null, 2)}</pre>
    </div>
  )
}