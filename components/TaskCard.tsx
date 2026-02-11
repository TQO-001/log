// components/TaskCard.tsx
export default function TaskCard({ title, description, status }: any) {
  const statusColors: any = {
    'Completed': 'bg-green-100 text-green-700',
    'In-Progress': 'bg-blue-100 text-blue-700',
    'Pending': 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{description}</p>
      <button className="text-xs font-semibold border-t border-slate-100 pt-4 w-full text-left flex items-center gap-2 hover:text-blue-600">
        <input type="checkbox" className="rounded-full" /> Mark as Completed
      </button>
    </div>
  );
}