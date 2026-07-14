import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
  key?: string;
}

// Icon helper to render the corresponding Lucide icon
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.FileQuestion className={className} />;
  }
  return <IconComponent className={className} />;
}

export default function ToolCard({ tool, onSelect }: ToolCardProps) {
  // Let's color-code based on category for Elegant Dark
  const getCategoryColor = () => {
    switch (tool.category) {
      case 'pdf':
        return {
          iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          textHover: 'group-hover:text-rose-400',
        };
      case 'image':
        return {
          iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
          textHover: 'group-hover:text-indigo-400',
        };
      case 'document':
        return {
          iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
          textHover: 'group-hover:text-purple-400',
        };
      default:
        return {
          iconBg: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
          textHover: 'group-hover:text-indigo-400',
        };
    }
  };

  const colors = getCategoryColor();

  return (
    <button
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/[0.08] hover:shadow-indigo-500/5 cursor-pointer"
      id={`tool-card-${tool.id}`}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between">
          {/* Custom Mapped Icon */}
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${colors.iconBg}`}>
            <ToolIcon name={tool.icon} className="h-5.5 w-5.5" />
          </div>

          {/* Badges */}
          {tool.badge && (
            <span className="inline-flex items-center rounded-md bg-linear-to-r from-indigo-500/10 to-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-450 dark:text-pink-400">
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className={`mt-4 font-sans text-sm.5 font-bold tracking-tight text-white transition-colors ${colors.textHover}`}>
          {tool.name}
        </h3>

        <p className="mt-2 font-sans text-xs.5 leading-relaxed text-slate-450 text-slate-400">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Process Now</span>
        <LucideIcons.ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
