export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dateAdded: string;      // ISO date string
  dateCompleted?: string;  // ISO date string
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
