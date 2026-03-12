import React, { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core'; // Core logic
import LeadCard from './LeadCard';

// 1. Droppable Column Component (Jahan cards drop honge)
const KanbanColumn = ({ id, title, count, children }) => {
  const { setNodeRef } = useDroppable({ id }); // Is column ko "Droppable" bana rahe hain

  return (
    <div ref={setNodeRef} className="min-w-[280px] flex-1 flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            id === 'New Lead' ? 'bg-blue-400' : 
            id === 'Contacted' ? 'bg-amber-400' :
            id === 'Qualified' ? 'bg-purple-400' : 'bg-emerald-400'
          }`} />
          {title}
        </h3>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{count}</span>
      </div>

      {/* Drop Zone Area */}
      <div className="bg-slate-900/30 rounded-xl p-2 flex-1 border border-slate-800/50 transition-colors">
        {children}
        <button className="w-full py-2 text-xs text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg border border-transparent hover:border-brand-primary/20 border-dashed transition-all mt-1">
          + Add New
        </button>
      </div>
    </div>
  );
};

// 2. Main Board Component
const KanbanBoard = () => {
  // State: Leads ka data yahan manage ho raha hai
  const [leads, setLeads] = useState([
    { id: 1, name: 'Rahul Sharma', company: 'Tech Corp', value: '5k', score: 85, status: 'New Lead' },
    { id: 2, name: 'Priya Singh', company: 'Design Studio', value: '12k', score: 45, status: 'Contacted' },
    { id: 3, name: 'Amit Verma', company: 'Logistics Inc', value: '8k', score: 92, status: 'Qualified' },
    { id: 4, name: 'Sneha Gupta', company: 'EduTech', value: '25k', score: 78, status: 'New Lead' },
    { id: 5, name: 'Vikram Malhotra', company: 'FinServe', value: '150k', score: 20, status: 'Won' },
  ]);

  const columns = ['New Lead', 'Contacted', 'Qualified', 'Won'];

  // 3. Logic: Jab Drag khatam ho toh kya karein?
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return; // Agar card hawa mein drop kiya toh kuch mat karo

    const leadId = active.id;
    const newStatus = over.id; // Jis column ke upar drop kiya

    // Data update karo
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id.toString() === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {columns.map((col) => (
          <KanbanColumn 
            key={col} 
            id={col} 
            title={col} 
            count={leads.filter(l => l.status === col).length}
          >
            {leads
              .filter((lead) => lead.status === col)
              .map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;