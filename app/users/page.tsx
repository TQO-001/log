import pool from "@/lib/db";
import Link from "next/link";
import { Users, Mail, BarChart3, ArrowLeft } from 'lucide-react';

export default async function UsersPage() {
  let teamMembers = [];

  try {
    // Raw SQL to get users and their task count in one go
    const query = `
      SELECT 
        u.id, u.full_name, u.email, u.avatar_url,
        COUNT(t.id) as task_count
      FROM log.users u
      LEFT JOIN log.tasks t ON u.id = t.user_id
      GROUP BY u.id
      ORDER BY task_count DESC
    `;
    const res = await pool.query(query);
    teamMembers = res.rows;
  } catch (e) {
    console.error("Database Error fetching users:", e);
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
            <Link href="/" className="text-slate-400 hover:text-black flex items-center gap-2 text-sm font-bold mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Team Members</h1>
        </div>
        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
            <Users size={18} /> {teamMembers.length} active
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {teamMembers.map((user: any) => (
          <div key={user.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-400">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">{user.full_name}</h3>
                <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <Mail size={12} /> {user.email}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
                        UID: {user.id}
                    </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contribution</p>
                    <p className="text-xl font-black text-slate-900">{user.task_count} Logs</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-black group-hover:text-white transition-all">
                    <BarChart3 size={20} />
                </div>
            </div>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300">
            No users found in laughtale_core.users
          </div>
        )}
      </div>
    </div>
  );
}