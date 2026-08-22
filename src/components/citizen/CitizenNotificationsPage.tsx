import React from 'react';
import { Bell, CheckCheck, Trash2, ArrowRight, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActivityNotification } from '../../types';
import { markNotificationRead, deleteNotification } from '../../services/firebase/notifications';

interface CitizenNotificationsPageProps {
  notifications: ActivityNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const CitizenNotificationsPage: React.FC<CitizenNotificationsPageProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll
}) => {
  const navigate = useNavigate();

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'danger':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Activity Updates
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Notifications ({notifications.length})
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status alerts for your submitted reports and municipal responses.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllRead}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="civic-card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              You're all caught up!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              New updates on your civic reports will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                void markNotificationRead(notif.id);
                if (notif.incidentId) {
                  navigate(`/citizen/reports/${notif.incidentId}`);
                }
              }}
              className={`civic-card p-4 sm:p-5 transition cursor-pointer flex items-start justify-between gap-4 group ${
                notif.isRead || notif.read ? 'opacity-80 hover:opacity-100' : 'border-blue-500/40 bg-blue-950/15'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {notif.title}
                    </h3>
                    {!(notif.isRead || notif.read) && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono pt-1">
                    {formatDate(notif.timestamp)}
                  </p>
                </div>
              </div>

              {notif.incidentId && (
                <div className="shrink-0 self-center">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-white text-xs font-semibold flex items-center space-x-1 transition">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
