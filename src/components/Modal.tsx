'use client';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  const maxW = size === 'sm' ? 420 : size === 'lg' ? 700 : 540;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-box" style={{ maxWidth: maxW }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close dialog" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
