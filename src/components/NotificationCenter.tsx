import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export default function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 max-w-[calc(100vw-32px)] sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <NotificationToast
            key={notif.id}
            notification={notif}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface NotificationToastProps {
  key?: string;
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 4000); // Auto close after 4s
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl bg-white border-y border-r border-[#E2E8F0] shadow-md text-[#1F2937] ${
        isSuccess
          ? 'border-l-4 border-l-[#EAB308]'
          : isError
          ? 'border-l-4 border-l-rose-500'
          : 'border-l-4 border-l-[#F59E0B]'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-[#EAB308]" />
        ) : (
          <AlertCircle className={`w-5 h-5 ${isError ? 'text-rose-500' : 'text-[#F59E0B]'}`} />
        )}
      </div>
      <div className="flex-1 text-sm font-bold leading-normal text-slate-800">
        {notification.message}
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
      </button>
    </motion.div>
  );
}
