import React from 'react';
import { Clock, Eye, UserCheck, Play, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { IncidentStatus } from '../../types';

interface StatusBadgeProps {
  status: IncidentStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const norm = status?.trim() || 'Pending';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  switch (norm) {
    case 'Pending':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses} ${className}`}>
          <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Pending</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 ${sizeClasses} ${className}`}>
          <Eye className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Under Review</span>
        </span>
      );
    case 'Assigned':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 ${sizeClasses} ${className}`}>
          <UserCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Assigned</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 ${sizeClasses} ${className}`}>
          <Play className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${sizeClasses} ${className}`}>
          <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Resolved</span>
        </span>
      );
    case 'Rejected':
    case 'Invalid':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 ${sizeClasses} ${className}`}>
          <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-700/50 text-slate-300 border border-slate-600 ${sizeClasses} ${className}`}>
          <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{norm}</span>
        </span>
      );
  }
};
