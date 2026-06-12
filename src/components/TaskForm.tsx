import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Type, AlignLeft } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  editingTask: Task | null;
  onSaveTask: (taskData: {
    title: string;
    description: string;
  }) => void;
  onCancelEdit?: () => void;
  onAddError: (msg: string) => void;
}

export default function TaskForm({ editingTask, onSaveTask, onCancelEdit, onAddError }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Sinks active editing values immediately
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onAddError('Please enter a valid task name.');
      return;
    }

    onSaveTask({
      title: title.trim(),
      description: description.trim(),
    });

    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <div id="task-form-panel" className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs transition-all hover:shadow-xs">
      <div className="flex items-center justify-between mb-5 select-none">
        <h2 className="text-lg font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 rounded-full bg-[#EAB308]" />
          {editingTask ? 'Edit Task Details' : 'Add New Task'}
        </h2>
        {editingTask && (
          <button
            onClick={onCancelEdit}
            className="p-1 px-2.5 rounded-lg border border-[#CBD5E1] text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Title */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="task-title-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-[#EAB308]" />
            Task Title <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-[#EAB308] text-sm text-[#1F2937] transition-all font-medium bg-white"
          />
        </div>

        {/* Task Description */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="task-desc-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
            Task Description
          </label>
          <textarea
            id="task-desc-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-[#EAB308] text-sm text-[#1F2937] transition-all resize-none font-medium bg-white"
          />
        </div>

        {/* Action Button */}
        <button
          id="task-form-submit-btn"
          type="submit"
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#EAB308] text-slate-900 hover:text-white font-bold text-sm hover:bg-[#CA8A04] transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:ring-4 focus:ring-amber-100"
        >
          {editingTask ? (
            <>
              <Save className="w-4 h-4" />
              Update Task
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
}
