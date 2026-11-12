"use client";

import React from "react";

// Progress bar for course phases - clean, minimal design
export const CourseProgress = ({ 
  phase1, phase2, phase3, phase4,
  hours1, hours2, hours3, hours4,
  modules1, modules2, modules3, modules4,
}: { 
  phase1: string;
  phase2?: string;
  phase3?: string;
  phase4?: string;
  hours1: number;
  hours2?: number;
  hours3?: number;
  hours4?: number;
  modules1: string;
  modules2?: string;
  modules3?: string;
  modules4?: string;
}) => {
  const phases = [
    { name: phase1, modules: modules1, hours: hours1 },
    phase2 && { name: phase2, modules: modules2!, hours: hours2! },
    phase3 && { name: phase3, modules: modules3!, hours: hours3! },
    phase4 && { name: phase4, modules: modules4!, hours: hours4! },
  ].filter(Boolean) as { name: string; modules: string; hours: number }[];
  
  const totalHours = phases.reduce((sum, p) => sum + p.hours, 0);
  
  return (
    <div className="my-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase, i) => (
          <div key={i} className="relative p-6 rounded bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="label mb-2">Phase {i + 1}</div>
            <h3 className="text-xl font-medium mb-3">{phase.name}</h3>
            <div className="flex items-baseline gap-2 text-[var(--fg-muted)]">
              <span className="label">Modules {phase.modules}</span>
              <span>·</span>
              <span className="label">{phase.hours}h</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <span className="label">{totalHours} hours total · ~{Math.ceil(totalHours / 6)} weeks at 6h/week</span>
      </div>
    </div>
  );
};

// Module card - collapsible, clean
export const ModuleCard = ({ 
  number, 
  title, 
  hours, 
  objective,
  children,
}: { 
  number: string;
  title: string;
  hours: number;
  objective: string;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="my-6 rounded bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden hover:border-[var(--fg-muted)] transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start gap-6 text-left"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded flex items-center justify-center border border-[var(--border)] label">
          {number}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-medium text-lg">{title}</h3>
            <span className="label whitespace-nowrap">{hours}h</span>
          </div>
          <p className="text-sm text-[var(--fg-muted)]">{objective}</p>
        </div>
        
        <svg 
          className={`flex-shrink-0 w-4 h-4 text-[var(--fg-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && children && (
        <div className="px-6 pb-6 border-t border-[var(--border)] pt-6">
          {children}
        </div>
      )}
    </div>
  );
};

// Vocabulary table - simple, readable
export const VocabTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-12 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 pr-8 label font-medium">Term</th>
            <th className="text-left py-3 pr-8 label font-medium">Meaning</th>
            <th className="text-left py-3 label font-medium hidden md:table-cell">Context</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const VocabRow = ({ term, meaning, context }: { term: string; meaning: string; context?: string }) => {
  return (
    <tr className="border-b border-[var(--border)]">
      <td className="py-4 pr-8"><code className="text-sm">{term}</code></td>
      <td className="py-4 pr-8 text-sm text-[var(--fg-muted)]">{meaning}</td>
      {context && <td className="py-4 text-sm text-[var(--fg-muted)] hidden md:table-cell">{context}</td>}
    </tr>
  );
};

// Principle - clean callout
export const Principle = ({ 
  number, 
  children 
}: { 
  number?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="my-8 flex gap-4 p-6 rounded bg-[var(--bg-card)] border border-[var(--border)]">
      {number && (
        <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center border border-[var(--border)] label">
          {number}
        </div>
      )}
      <div className="flex-1 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// Phase card
export const PhaseCard = ({
  phase,
  modules,
  description,
  hours,
}: {
  phase: string;
  modules: string;
  description: string;
  hours: number;
}) => {
  return (
    <div className="my-12 p-8 rounded bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="flex items-start justify-between gap-6 mb-4">
        <div>
          <div className="label mb-2">Modules {modules}</div>
          <h3 className="text-2xl font-medium">{phase}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-medium">{hours}</div>
          <div className="label">hours</div>
        </div>
      </div>
      <p className="text-[var(--fg-muted)] leading-relaxed">{description}</p>
    </div>
  );
};

// Check yourself - subtle, clean
export const CheckYourself = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-8 p-6 rounded bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="label mb-2">Check Yourself</div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
};

// Learning outcome badge - minimal
export const Outcome = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      {children}
    </div>
  );
};

// Tech stack - simple grid
export const TechStack = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-3">
      {children}
    </div>
  );
};

export const TechItem = ({ name }: { name: string }) => {
  return (
    <div className="p-4 rounded bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors">
      <div className="label">{name}</div>
    </div>
  );
};

// Code comparison - clean side-by-side
export const CodeCompare = ({
  title,
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After"
}: {
  title: string;
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) => {
  return (
    <div className="my-12">
      <div className="label mb-4">{title}</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="label mb-2 px-4">{beforeLabel}</div>
          <pre className="p-4 rounded bg-[var(--bg-card)] border border-[var(--border)] overflow-x-auto text-xs leading-relaxed">
            <code>{before}</code>
          </pre>
        </div>
        <div>
          <div className="label mb-2 px-4">{afterLabel}</div>
          <pre className="p-4 rounded bg-[var(--bg-card)] border border-[var(--accent)]/30 overflow-x-auto text-xs leading-relaxed">
            <code>{after}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
