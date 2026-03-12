import React from 'react';
import { useDraggable } from '@dnd-kit/core'; // Hook for dragging
import { MoreHorizontal, Phone, Mail, GripVertical } from 'lucide-react';

const LeadCard = ({ lead }) => {
  // 1. Dnd-kit hook setup
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id.toString(), // Unique ID zaroori hai
  });

  // 2. Styling for movement (jab card drag ho raha ho)
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999, // Drag karte waqt card sabse upar dikhe
  } : undefined;

  // AI Score Color Logic
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 50) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700 hover:border-brand-primary/50 transition-all cursor-grab active:cursor-grabbing mb-3 shadow-sm group relative"
    >
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{lead.name}</h4>
            <p className="text-[10px] text-slate-500">{lead.company}</p>
          </div>
        </div>
        {/* Drag Handle Icon (Hover pe dikhega) */}
        <GripVertical size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* AI Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`text-[10px] font-medium px-2 py-1 rounded-md border ${getScoreColor(lead.score)} flex items-center gap-1`}>
          ✨ AI Score: {lead.score}%
        </div>
        <span className="text-xs font-bold text-slate-300">${lead.value}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
        <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors"><Mail size={14} /></button>
        <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors"><Phone size={14} /></button>
        <span className="text-[10px] text-slate-600 ml-auto">2h ago</span>
      </div>
      
    </div>
  );
};

export default LeadCard;