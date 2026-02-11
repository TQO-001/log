'use client'

import { toggleTaskStatus, deleteTask } from '@/app/actions';
import { Trash2 } from 'lucide-react';

export default function TaskCheckbox({ id, isCompleted }: { id: number, isCompleted: boolean }) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={isCompleted}
          onChange={async () => await toggleTaskStatus(id, isCompleted)}
          className="w-6 h-6 rounded-lg border-slate-200 accent-black cursor-pointer transition-transform active:scale-90" 
        />
        <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-green-500' : 'text-slate-500'}`}>
          {isCompleted ? 'Completed' : 'Mark as Done'}
        </span>
      </div>

      <button 
        onClick={async () => {
          if(confirm("Delete this task?")) await deleteTask(id);
        }}
        className="text-slate-300 hover:text-red-500 transition-colors p-1"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}