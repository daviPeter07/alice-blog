'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { FileText, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarkdownContentFieldProps {
  id: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

type ViewMode = 'text' | 'preview';

export function MarkdownContentField({
  id,
  name,
  value,
  onChange,
  defaultValue,
  required,
  placeholder = 'Escreva seu artigo em Markdown. Use **negrito**, *itálico*, # título, - lista...',
  rows = 14,
  className,
}: MarkdownContentFieldProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [localValue, setLocalValue] = useState(value ?? defaultValue ?? '');

  const displayValue = value !== undefined ? value : localValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setViewMode('text')}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-ui text-sm font-medium transition-colors',
            viewMode === 'text'
              ? 'bg-brand-green text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <FileText className="size-4" />
          Texto
        </button>
        <button
          type="button"
          onClick={() => setViewMode('preview')}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-ui text-sm font-medium transition-colors',
            viewMode === 'preview'
              ? 'bg-brand-green text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <Eye className="size-4" />
          Preview
        </button>
      </div>

      {/* Textarea sempre no DOM para o formulário enviar o valor */}
      <textarea
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground resize-y whitespace-pre-wrap break-words',
          viewMode === 'preview' && 'sr-only'
        )}
        aria-hidden={viewMode === 'preview'}
      />
      {viewMode === 'preview' && (
        <div
          className="min-h-[280px] rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground overflow-auto"
          aria-hidden
        >
          <div className="prose-alice prose-alice-preview">
            {displayValue ? (
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>{displayValue}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nenhum conteúdo para visualizar.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
