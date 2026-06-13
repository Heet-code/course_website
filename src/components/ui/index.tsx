import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, AlertCircle, X, ChevronDown, Check, Loader2 } from 'lucide-react';

// ==========================================
// 1. BUTTON
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-ctrl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-[#111827] hover:bg-primary-hover active:bg-opacity-95 focus-visible:ring-primary/45",
    secondary: "bg-surface-muted text-text-main border border-border-strong hover:bg-[#2A2F3A] dark:hover:bg-[#2A2F3A] focus-visible:ring-secondary/45",
    success: "bg-success text-white hover:bg-opacity-90",
    warning: "bg-warning text-white hover:bg-opacity-90",
    danger: "bg-transparent text-[#F87171] hover:bg-[rgba(220,38,38,0.12)] border border-transparent",
    outline: "border border-border bg-transparent text-text-main hover:bg-surface-muted",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-surface-muted"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 h-[36px]",
    md: "px-4 py-2 text-sm gap-2 h-[44px]",
    lg: "px-6 py-3 text-base gap-2.5 h-[52px]"
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

// ==========================================
// 2. INPUT CONTROLS
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full h-[44px] px-3.5 bg-surface-muted text-text-main border border-border rounded-ctrl text-sm placeholder-text-subtle transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/35 disabled:opacity-50 ${error ? 'border-danger focus:border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full p-3 bg-surface-muted text-text-main border border-border rounded-ctrl text-sm placeholder-text-subtle transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/35 disabled:opacity-50 ${error ? 'border-danger focus:border-danger' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {error}</p>}
    </div>
  );
};

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full h-[44px] appearance-none px-3.5 bg-surface-muted text-text-main border border-border rounded-ctrl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/35 pr-10 disabled:opacity-50 ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-text-subtle" />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
};

// ==========================================
// 3. BADGE
// ==========================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    primary: "bg-primary/20 text-[#111827] dark:text-primary border border-primary/40",
    secondary: "bg-secondary/20 text-text-main dark:text-secondary border border-secondary/40",
    success: "bg-success/15 text-green-700 dark:text-green-300 border border-success/30",
    warning: "bg-warning/15 text-amber-700 dark:text-amber-300 border border-warning/30",
    danger: "bg-danger/15 text-red-700 dark:text-red-300 border border-danger/30",
    neutral: "bg-surface-muted text-text-muted border border-border"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// 4. CHECKBOX / RADIO
// ==========================================
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  const checkboxId = id || `chk-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <label htmlFor={checkboxId} className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-text-main ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        className="sr-only peer"
        {...props}
      />
      <div className="h-4.5 w-4.5 flex items-center justify-center rounded-ctrl border border-border bg-surface-muted transition-all peer-checked:bg-secondary peer-checked:border-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary">
        <Check className="h-3 w-3 text-white stroke-[3px] scale-0 peer-checked:scale-100 transition-transform" />
      </div>
      <span>{label}</span>
    </label>
  );
};

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  const radioId = id || `rad-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <label htmlFor={radioId} className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-text-main ${className}`}>
      <input
        type="radio"
        id={radioId}
        className="sr-only peer"
        {...props}
      />
      <div className="h-4.5 w-4.5 flex items-center justify-center rounded-full border border-border bg-surface-muted transition-all peer-checked:border-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary">
        <div className="h-2 w-2 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform" />
      </div>
      <span>{label}</span>
    </label>
  );
};

// ==========================================
// 5. CARD
// ==========================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false,
  ...props
}) => {
  const clickStyle = onClick ? 'cursor-pointer' : '';
  const hoverStyle = hoverable ? 'hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-sm' : '';
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-card p-5 transition-all duration-200 shadow-sm ${clickStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================
// 6. MODAL
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg bg-surface border border-border rounded-overlay shadow-xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-200 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg-elevated/50">
          <h3 id="modal-title" className="text-base font-extrabold text-text-main">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-ctrl text-text-subtle hover:bg-surface-muted hover:text-text-main focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-border bg-bg-elevated/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. TABS
// ==========================================
interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-border overflow-x-auto no-scrollbar gap-1" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap focus:outline-none ${
              isActive
                ? 'border-secondary text-secondary font-bold'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 8. ACCORDION
// ==========================================
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div
            key={item.id}
            className="border border-border rounded-card bg-surface overflow-hidden text-left"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-sm text-text-main hover:bg-surface-muted transition-all focus:outline-none"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <ChevronDown className={`h-4 w-4 text-text-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`transition-all duration-200 overflow-hidden ${
                isOpen ? 'max-h-[500px] border-t border-border' : 'max-h-0'
              }`}
            >
              <div className="p-5 text-sm leading-relaxed text-text-muted bg-bg-elevated/30">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 9. AVATAR
// ==========================================
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-14 w-14 text-lg"
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-secondary text-[#111827] font-bold overflow-hidden select-none flex-shrink-0 ${sizes[size]} ${className}`}>
      {src && !error ? (
        <img
          src={src}
          alt={name}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// ==========================================
// 10. TABLE
// ==========================================
interface TableColumn<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export const Table = <T extends unknown>({ columns, data, emptyMessage = "No data available" }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-card">
      <table className="w-full text-left border-collapse bg-surface">
        <thead>
          <tr className="border-b border-border bg-bg-elevated/40">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-subtle ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length > 0 ? (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-bg-elevated/20 transition-all">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={`px-4 py-3.5 text-sm text-text-muted ${col.className || ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-text-subtle bg-surface">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================
// 11. DROPDOWN
// ==========================================
interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 z-40 bg-surface border border-border rounded-card shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-155 focus:outline-none">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left font-semibold transition-all ${
                item.danger 
                  ? 'text-[#F87171] hover:bg-danger/10' 
                  : 'text-text-main hover:bg-surface-muted'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. PROGRESS BAR
// ==========================================
export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  return (
    <div className={`w-full text-left ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold mb-1">
        <span className="text-text-subtle">Progress</span>
        <span className="text-secondary">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border/50">
        <div
          className="h-full bg-secondary transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 13. STATS CARD
// ==========================================
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, isPositive = true }) => {
  return (
    <Card className="flex items-start justify-between relative overflow-hidden bg-surface border border-border text-left hover:-translate-y-1 hover:border-secondary transition-all duration-300 shadow-[0_4px_12px_-2px_rgba(17,24,39,0.04)] hover:shadow-[0_12px_24px_-10px_rgba(17,24,39,0.1)]">
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-text-subtle uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-text-main leading-none">{value}</h3>
        {change && (
          <p className={`text-xs font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-secondary/10 text-secondary rounded-card flex-shrink-0">
        {icon}
      </div>
    </Card>
  );
};

// ==========================================
// 14. SEARCH BAR
// ==========================================
export const SearchBar: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search catalog..." }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-subtle" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[44px] pl-10 pr-4 bg-surface-muted text-text-main border border-border rounded-ctrl text-sm placeholder-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/35"
      />
    </div>
  );
};

// ==========================================
// 15. FILTER BAR
// ==========================================
interface FilterBarProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
  selectedPriceType?: string;
  onSelectPriceType?: (priceType: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedPriceType = '',
  onSelectPriceType
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 text-left">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all ${
            selectedCategory === ''
              ? 'bg-secondary text-[#111827] border-secondary font-black shadow-sm'
              : 'bg-surface border-border text-text-muted hover:border-secondary'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all ${
              selectedCategory === cat.name
                ? 'bg-secondary text-[#111827] border-secondary font-black shadow-sm'
                : 'bg-surface border-border text-text-muted hover:border-secondary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-text-subtle flex-shrink-0" />
        
        {/* Difficulty Selector */}
        <span className="text-xs text-text-subtle font-extrabold uppercase tracking-wider">Difficulty:</span>
        <select
          value={selectedDifficulty}
          onChange={(e) => onSelectDifficulty(e.target.value)}
          className="px-2.5 py-1 bg-surface-muted text-text-main border border-border rounded-ctrl text-xs font-bold focus:outline-none"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* Price Selector */}
        {onSelectPriceType && (
          <>
            <span className="text-xs text-text-subtle font-extrabold uppercase tracking-wider ml-2">Price:</span>
            <select
              value={selectedPriceType}
              onChange={(e) => onSelectPriceType(e.target.value)}
              className="px-2.5 py-1 bg-surface-muted text-text-main border border-border rounded-ctrl text-xs font-bold focus:outline-none"
            >
              <option value="">All Prices</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 16. EMPTY STATE
// ==========================================
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-surface border border-border rounded-card max-w-lg mx-auto my-6">
      <div className="p-4 bg-secondary/10 text-secondary rounded-full mb-4">
        {icon || <AlertCircle className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-extrabold text-text-main mb-1.5">{title}</h3>
      <p className="text-xs text-text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};

// ==========================================
// 17. LOADING SKELETON
// ==========================================
export const LoadingSkeleton: React.FC<{ variant?: 'card' | 'table' | 'profile'; count?: number }> = ({ variant = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse text-left">
        <div className="h-10 bg-surface-muted rounded-ctrl" />
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-surface/50 rounded-ctrl" />
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="flex items-center gap-4 animate-pulse text-left">
        <div className="h-14 w-14 rounded-full bg-surface-muted" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-surface-muted rounded-ctrl w-1/3" />
          <div className="h-3 bg-surface/50 rounded-ctrl w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="border border-border rounded-card p-5 bg-surface space-y-4">
          <div className="h-40 bg-surface-muted rounded-card w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-muted rounded-ctrl w-3/4" />
            <div className="h-3 bg-surface/50 rounded-ctrl w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-surface/50 rounded-full w-16" />
            <div className="h-6 bg-surface-muted rounded-ctrl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 18. TOAST NOTIFICATION
// ==========================================
interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgTypes = {
    success: "bg-success text-white border-l-4 border-emerald-800",
    warning: "bg-warning text-white border-l-4 border-amber-800",
    danger: "bg-danger text-white border-l-4 border-red-900",
    info: "bg-secondary text-[#111827] border-l-4 border-slate-700"
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-ctrl shadow-lg text-sm max-w-sm ${bgTypes[type]} animate-in slide-in-from-bottom-5 duration-300`}>
      <span className="font-bold">{message}</span>
      <button onClick={onClose} className="hover:bg-white/20 p-0.5 rounded-full transition-all focus:outline-none">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
