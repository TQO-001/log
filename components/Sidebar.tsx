import pool from "@/lib/db";
import { Home, Trash2, FolderPlus, Users, LayoutDashboard } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import Link from 'next/link';
import { createProject, deleteProject } from '@/app/actions';

export default async function Sidebar() {
  let projects = [];
  try {
    const projectRes = await pool.query('SELECT * FROM log.projects ORDER BY name ASC');
    projects = projectRes.rows;
  } catch (e) {
    console.error("Sidebar Project Fetch Error:", e);
  }

  return (
    <aside className="w-64 border-r border-slate-100 h-screen p-6 flex flex-col bg-white shrink-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">CL</div>
        <span className="font-bold text-xl tracking-tight text-slate-900">Captain&apos;s Log</span>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-3">Menu</div>
        
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-slate-50 text-slate-600 hover:text-black">
          <Home size={20}/> <span className="text-sm font-medium">Home</span>
        </Link>

        <Link href="/users" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-slate-50 text-slate-600 hover:text-black mb-8">
          <Users size={20}/> <span className="text-sm font-medium">Team Members</span>
        </Link>

        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-3">Projects</div>
        
        <div className="space-y-1 mb-6">
          {projects.map((project: any) => (
            <div key={project.id} className="group flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-xl transition-all">
              <Link href={`/?project=${project.id}`} className="flex items-center gap-3 flex-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }}></span>
                <span className="text-sm font-medium text-slate-600 group-hover:text-black">
                  {project.name}
                </span>
              </Link>
              <form action={async () => { 'use server'; await deleteProject(project.id); }}>
                <button type="submit" className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          ))}
        </div>

        <div className="px-3">
          <form action={createProject} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <input name="name" placeholder="New project..." className="bg-transparent border-none text-xs flex-1 outline-none" />
              <button type="submit" className="text-slate-400 hover:text-black transition-colors">
                <FolderPlus size={16} />
              </button>
            </div>
          </form>
        </div>
      </nav>

      <div className="pt-6 border-t border-slate-50">
         <AddTaskModal />
      </div>
    </aside>
  );
}