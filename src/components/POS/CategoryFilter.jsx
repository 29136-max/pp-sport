import React from 'react';
import { 
  LayoutGrid, 
  CircleDot, 
  Zap, 
  Circle, 
  Footprints, 
  Dumbbell, 
  Waves, 
  Trophy 
} from 'lucide-react';
import { CATEGORIES } from '../../lib/supabase';

const ICON_MAP = {
  LayoutGrid,
  CircleDot,
  Zap,
  Circle,
  Footprints,
  Dumbbell,
  Waves,
  Trophy
};

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || LayoutGrid;
        const isSelected = selectedCategory === cat.slug;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
              isSelected
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
