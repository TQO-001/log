'use client'

import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { addTask } from '@/app/actions';

interface Project {
  id: number;
  name: string;
}

export default function AddTaskModalClient({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full bg-black text-white p-4 rounded-2xl justify-center font-bold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all"
      >
        <Plus size={18} /> New Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">New Task</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>

            <form action={async (formData) => {
              await addTask(formData);
              setIsOpen(false);
            }}>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Task Title</label>
                  <input 
                    name="title"
                    required
                    autoFocus
                    placeholder="What are we working on?"
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none text-lg font-medium focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Assign to Project</label>
                  <div className="relative">
                    <select 
                      name="project_id"
                      className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none text-sm font-bold text-slate-600 appearance-none cursor-pointer focus:ring-2 focus:ring-black transition-all"
                    >
                      <option value="">No Project (General)</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 p-4 font-bold text-slate-400 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-black text-white p-4 rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}