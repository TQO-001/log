'use client'

import { Search as SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
        <SearchIcon size={18} />
      </div>
      <input
        type="text"
        placeholder="Search logs..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full bg-white border border-slate-100 py-3 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all text-sm font-medium ${isPending ? 'opacity-50' : ''}`}
      />
    </div>
  );
}