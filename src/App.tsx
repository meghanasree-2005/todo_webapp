import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  FileText, 
  X, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import { Task, TaskStatus, AppNotification } from './types';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import NotificationCenter from './components/NotificationCenter';

// elegant seeded tasks for visual first-use quality
const SEED_TASKS: Task[] = [
  {
    id: 'seed-1',
    title: 'Review production styling guidelines',
    description: 'Ensure correct layouts, contrast compliance, proper padding rhythm, and correct element pairings across different screen media.',
    status: 'pending',
    dateAdded: '2026-06-12T08:15:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Incorporate user accessibility properties',
    description: 'Add semantic HTML labels, clear input focuses, explicit accessible label attributes, and comfortable touch targets.',
    status: 'pending',
    dateAdded: '2026-06-12T09:45:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'Validate browser local storage engines',
    description: 'Audit fallback states and task synchronization routines for offline browser compatibility.',
    status: 'completed',
    dateAdded: '2026-06-11T14:30:00.000Z',
    dateCompleted: '2026-06-12T13:15:00.000Z',
  }
];

export default function App() {
  // Task state stored in reactive memory, synchronized with localStorage fallback
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todo-app-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached task lists', e);
      }
    }
    return SEED_TASKS;
  });

  // Current entity being modified in the single-form panel
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // App notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals controllers
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Active viewing filter for mobile & tablet screen layouts
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  // Save changes to cache
  useEffect(() => {
    localStorage.setItem('todo-app-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Dispatch toast helper
  const triggerNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      type,
      message,
    };
    setNotifications((prev) => [...prev, newNotif]);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Add Task or Edit Task Submission handler
  const handleSaveTask = (taskData: { title: string; description: string }) => {
    if (editingTask) {
      // Update Mode
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: taskData.title,
                description: taskData.description || undefined,
              }
            : t
        )
      );
      triggerNotification('Task updated successfully.', 'success');
      setEditingTask(null);
    } else {
      // Add Mode
      const newTask: Task = {
        id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        title: taskData.title,
        description: taskData.description || undefined,
        status: 'pending',
        dateAdded: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      triggerNotification('Task added successfully.', 'success');
    }
  };

  const handleEditInit = (task: Task) => {
    setEditingTask(task);
    // Focus the task title input field immediately
    const inputEl = document.getElementById('task-title-input');
    if (inputEl) {
      inputEl.focus();
    }
    triggerNotification(`Editing "${task.title.substring(0, 16)}..."`, 'info');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (taskToDelete) {
      triggerNotification(`Task "${taskToDelete.title.substring(0, 20)}..." was deleted permanently.`, 'info');
    }
    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  };

  const handleToggleComplete = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const isCompleting = targetTask.status === 'pending';
    if (isCompleting) {
      triggerNotification(`Success! "${targetTask.title.substring(0, 24)}${targetTask.title.length > 24 ? '...' : ''}" has been completed.`, 'success');
    } else {
      triggerNotification(`"${targetTask.title.substring(0, 24)}${targetTask.title.length > 24 ? '...' : ''}" moved back to pending list.`, 'info');
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: isCompleting ? 'completed' : 'pending',
            dateCompleted: isCompleting ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Split tasks easily
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFCE8]">
      {/* Toast Notification Hub */}
      <NotificationCenter
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#CA8A04] to-[#F59E0B] flex items-center justify-center text-white shadow-xs">
              <CheckCircle className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div className="text-left select-none">
              <span className="block text-base font-extrabold tracking-tight text-[#1F2937]">To-Do List Manager</span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Organize your daily tasks efficiently</span>
            </div>
          </div>

          {/* Quick Header Toggles */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-[#CA8A04] hover:bg-amber-50/50 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Help Center"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-amber-50/30 px-2.5 py-1.5 rounded-lg border border-amber-100/30 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Sandbox Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Column: Task Input Form (4 grid columns span) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <TaskForm
              editingTask={editingTask}
              onSaveTask={handleSaveTask}
              onCancelEdit={handleCancelEdit}
              onAddError={(msg) => triggerNotification(msg, 'error')}
            />

            {/* Ambient Tip panel below form */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/30 text-left">
              <div className="flex gap-2 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                <div className="space-y-1 font-semibold leading-relaxed">
                  <p>Task management is simplified down to pure details.</p>
                  <p className="text-[11px] text-[#B45309] font-normal">All edits propagate instantly. Completed items display precise completion parameters automatically.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Column: Task Management Area (8 grid columns span) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tablet & Mobile Tab Bar (lg:hidden) */}
            <div className="lg:hidden flex p-1 bg-slate-100 rounded-xl max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-grow py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-[#CA8A04] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex-grow py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'pending'
                    ? 'bg-white text-[#CA8A04] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending ({pendingTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-grow py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'completed'
                    ? 'bg-white text-[#D97706] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>

            <div className="space-y-6 flex flex-col w-full">
              
              {/* Active / Pending Tasks lists */}
              <div 
                id="col-pending-tasks" 
                className={`space-y-4 bg-slate-200/10 border border-slate-200/60 rounded-2xl p-4 transition-all ${
                  activeTab === 'completed' ? 'hidden' : 'block'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 select-none">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#CA8A04]" />
                    <h2 className="text-sm font-extrabold text-[#1F2937] tracking-tight">Pending Tasks</h2>
                  </div>
                  <span className="text-[11px] bg-amber-50 font-extrabold px-2.5 py-0.5 rounded-full text-[#CA8A04]">
                    {pendingTasks.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl p-5 text-slate-400">
                      <span className="block text-xs font-semibold text-slate-500">No Pending Tasks</span>
                      <span className="block text-[10px] mt-1 text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                        Excellent performance! Enter details in the form on the left to add a brand new item.
                      </span>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {pendingTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditInit}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Completed Tasks lists */}
              <div 
                id="col-completed-tasks" 
                className={`space-y-4 bg-amber-50/10 border border-amber-100/30 rounded-2xl p-4 transition-all ${
                  activeTab === 'pending' ? 'hidden' : 'block'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 select-none">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                    <h2 className="text-sm font-extrabold text-[#1F2937] tracking-tight">Completed Tasks</h2>
                  </div>
                  <span className="text-[11px] bg-amber-100/50 font-extrabold px-2.5 py-0.5 rounded-full text-[#D97706]">
                    {completedTasks.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {completedTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-dashed border-sky-100/30 rounded-2xl p-5 text-slate-400">
                      <span className="block text-xs font-semibold text-slate-500">No Completed Tasks</span>
                      <span className="block text-[10px] mt-1 text-slate-400 max-w-[180px] mx-auto leading-relaxed">
                        Completed tasks show up here with precise timestamps recording the time of completion.
                      </span>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {completedTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditInit}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Interactive Modal Screens */}

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl relative z-10 text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#EAB308]" />
                  User Help Center
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed overflow-y-auto max-h-[300px]">
                <p className="font-semibold text-slate-800">Quick App Overview</p>
                <p>
                  Welcome to To-Do List Manager! This tool is engineered offline-first to help you structure tasks. Simply enter task title and description on the left hand side to create items.
                </p>

                <p className="font-semibold text-slate-800 pt-1">Features available:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Complete button:</strong> Clucking complete instantly records complete date and time, and automatically moves cards into the Completed section.</li>
                  <li><strong>Instant Edits:</strong> Clicking Edit immediately targets your field variables and changes update instantly.</li>
                  <li><strong>Permanent Delete:</strong> Permanently erase tasks at any time with robust safety validation alerts.</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-colors cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl relative z-10 text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F59E0B]" />
                  Privacy Policy
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed overflow-y-auto max-h-[300px]">
                <p className="font-semibold text-slate-800">Secure Client Storage</p>
                <p>
                  Any information written in this task form resides exclusively within your device's cached browser engine via HTML5 Local Storage. No cloud transfers or network logs tracking your schedule occur, guaranteeing total confidentiality.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs tracking-wide transition-colors cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
