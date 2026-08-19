import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Trash2, 
  Check
} from 'lucide-react';
import { ActivityNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: ActivityNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#090d16] border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Activity & Dispatch Feed
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onMarkAllRead}
            className="flex items-center space-x-1 hover:text-cyan-300 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>

          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 hover:text-rose-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear feed</span>
          </button>
        </div>

        {/* Notification Items */}
        <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No recent notifications.
            </div>
          ) : (
            notifications.map((notif) => {
              const iconColor =
                notif.type === 'danger' ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' :
                notif.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                notif.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                'text-blue-400 bg-blue-500/10 border-blue-500/30';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    notif.isRead
                      ? 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                      : 'bg-slate-900 border-blue-500/40 text-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${iconColor}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
