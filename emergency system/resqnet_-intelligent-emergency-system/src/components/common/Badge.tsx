import React from 'react';
import { IncidentStatus, ResourceStatus, SeverityLevel } from '../../types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const variantClasses = {
    default: 'bg-slate-800 text-slate-200 border border-slate-700',
    critical: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
    low: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide uppercase ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: SeverityLevel; pulse?: boolean }> = ({ severity, pulse }) => {
  const map: Record<SeverityLevel, { variant: BadgeProps['variant']; label: string }> = {
    CRITICAL: { variant: 'critical', label: 'Critical' },
    HIGH: { variant: 'high', label: 'High' },
    MEDIUM: { variant: 'medium', label: 'Medium' },
    LOW: { variant: 'low', label: 'Low' },
  };

  const { variant, label } = map[severity] || { variant: 'default', label: severity };

  return (
    <Badge variant={variant} pulse={pulse || severity === 'CRITICAL'}>
      {label}
    </Badge>
  );
};

export const IncidentStatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  const map: Record<IncidentStatus, { variant: BadgeProps['variant']; label: string }> = {
    REPORTED: { variant: 'warning', label: 'Reported' },
    VERIFIED: { variant: 'info', label: 'Verified' },
    PRIORITIZED: { variant: 'purple', label: 'Prioritized' },
    RESOURCE_ASSIGNED: { variant: 'high', label: 'Assigned' },
    EN_ROUTE: { variant: 'high', label: 'En Route' },
    ON_SCENE: { variant: 'critical', label: 'On Scene' },
    RESOLVED: { variant: 'success', label: 'Resolved' },
  };

  const { variant, label } = map[status] || { variant: 'default', label: status };

  return <Badge variant={variant}>{label}</Badge>;
};

export const ResourceStatusBadge: React.FC<{ status: ResourceStatus }> = ({ status }) => {
  const map: Record<ResourceStatus, { variant: BadgeProps['variant']; label: string; pulse?: boolean }> = {
    AVAILABLE: { variant: 'success', label: 'Available' },
    ASSIGNED: { variant: 'purple', label: 'Assigned' },
    EN_ROUTE: { variant: 'high', label: 'En Route', pulse: true },
    ON_SCENE: { variant: 'critical', label: 'On Scene' },
    UNAVAILABLE: { variant: 'outline', label: 'Unavailable' },
  };

  const { variant, label, pulse } = map[status] || { variant: 'default', label: status };

  return <Badge variant={variant} pulse={pulse}>{label}</Badge>;
};
