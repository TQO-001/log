import pool from "@/lib/db";
import TaskCheckbox from "@/components/TaskCheckbox";
import Link from "next/link";
import Search from "@/components/Search"; // Import our new component
import { CheckCircle2, Circle, Activity } from 'lucide-react';

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ project?: string, q?: string }> 
}) {
  const params = await searchParams;
  const projectId = params.project;
  const queryParam = params.q;

  let tasks = [];
  let projectName = "";
  let userName = "Guest";
  let stats = { total: 0, completed: 0, active: 0 };

  try {
    // 1. Fetch User Data
    const userRes = await pool.query('SELECT full_name FROM log.users WHERE id = $1', ['thulani_dev']);
    if (userRes.rows.length > 0) userName = userRes.rows[0].full_name;

    // 2. Fetch Tasks with Search Filter
    let taskSql = 'SELECT * FROM log.tasks WHERE 1=1';
    const values: any[] = [];

    if (projectId) {
      values.push(projectId);
      taskSql += ` AND project_id = $${values.length}`;
    }

    if (queryParam) {
      values.push(`%${queryParam}%`);
      taskSql += ` AND title ILIKE $${values.length}`;
    }

    taskSql += ' ORDER BY created_at DESC';
    const res = await pool.query(taskSql, values);
    tasks = res.rows;

    // 3. Fetch Stats
    const statsRes = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_completed = true) as completed FROM log.tasks');
    stats = {
      total: parseInt(statsRes.rows[0].total),
      completed: parseInt(statsRes.rows[0].completed),
      active: parseInt(statsRes.rows[0].total) - parseInt(statsRes.rows[0].completed)
    };

    if (projectId) {
      const pRes = await pool.query('SELECT name FROM log.projects WHERE id = $1', [projectId]);
      if (pRes.rows.length > 0) projectName = pRes.rows[0].name;
    }
  } catch (e) {
    console.error("Dashboard Data Error:", e);
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                    {projectId ? projectName : `Welcome back, ${userName}!`}
                </h1>
                <p className="text-slate-400 text-sm font-medium">Your daily stream overview.</p>
            </div>
            <Search />
        </div>

        {/* Stats Pulse Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tasks</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Circle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">In Progress</p>
              <p className="text-2xl font-black text-slate-900">{stats.active}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed</p>
              <p className="text-2xl font-black text-slate-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 border-b border-slate-100 pb-2">
          <Link href="/" className={`text-sm pb-2 px-1 ${!projectId ? 'font-bold border-b-2 border-black' : 'text-slate-400'}`}>
            All Logs
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tasks.map((task: any) => (
          <div key={task.id} className={`bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:shadow-md ${task.is_completed ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <span className={`w-3 h-3 rounded-full ${task.is_completed ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]'}`}></span>
            </div>
            <h3 className={`font-bold text-2xl mb-2 tracking-tight ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {task.title}
            </h3>
            <p className="text-slate-400 text-xs font-mono mb-8 italic uppercase tracking-widest">Data Stream Active</p>
            <TaskCheckbox id={task.id} isCompleted={task.is_completed} />
          </div>
        ))}
        
        {tasks.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 font-mono text-xs uppercase tracking-widest">
                No matching logs found
            </div>
        )}
      </div>
    </div>
  );
}