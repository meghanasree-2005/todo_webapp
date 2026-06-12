import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  key?: string;
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onToggleComplete, onDelete }: TaskCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      id={`task-card-${task.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className={`relative bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs transition-all hover:shadow-xs text-left overflow-hidden`}
    >
      {/* Overlay Delete Confirmation banner compatible with thin horizontal row */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-amber-50/95 px-4 py-2 flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between gap-3 z-10 animate-fade-in">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs select-none">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>Delete <strong className="text-slate-800">"{task.title.substring(0, 20)}{task.title.length > 20 ? '...' : ''}"</strong>?</span>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(task.id);
                setShowConfirmDelete(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Row layout containing Title, Description, Edit, Delete options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left Side: Complete status checkbox + text columns (Title & Description) */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          
          {/* Complete Option (Circle checklist checkbox) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.90 }}
            onClick={() => onToggleComplete(task.id)}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:ring-2 focus:ring-amber-200 mt-0.5 ${
              isCompleted 
                ? 'bg-[#FEFCE8] text-[#D97706] border-2 border-[#EAB308]' 
                : 'border-2 border-slate-300 text-slate-300 hover:border-[#EAB308] hover:bg-amber-100/40 hover:text-[#D97706]'
            }`}
            title={isCompleted ? "Mark as pending" : "Mark as complete"}
            aria-label={isCompleted ? "Mark as pending" : "Complete task"}
          >
            <CheckCircle2 className={`w-4.5 h-4.5 ${isCompleted ? 'fill-amber-500/15 text-[#EAB308]' : ''}`} />
          </motion.button>

          {/* Title & Description Column details */}
          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className={`text-sm font-bold text-slate-800 tracking-tight leading-snug break-words ${
              isCompleted ? 'line-through text-slate-400 font-medium' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-xs leading-normal text-slate-500 whitespace-pre-wrap break-words ${
                isCompleted ? 'text-slate-400 opacity-80' : ''
              }`}>
                {task.description}
              </p>
            )}
          </div>

        </div>

        {/* Right Side: Simple Edit and Delete action controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
          
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs font-bold text-slate-600 hover:text-[#D97706] hover:border-amber-200 hover:bg-amber-50/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-100"
            title="Edit task detail"
            aria-label="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-50 bg-rose-50/20 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-100"
            title="Delete task permanently"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

        </div>

      </div>
    </motion.div>
  );
}
