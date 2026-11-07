'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal } from '@/components/common/Modal';

interface ModalOptions {
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
}

interface ModalContextType {
  showAlert: (message: string, title?: string) => void;
  showConfirm: (options: ModalOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalOptions>({
    message: '',
    title: '알림',
    confirmText: '확인',
    cancelText: '취소',
    isConfirm: false,
  });

  const showAlert = useCallback((message: string, title: string = '알림') => {
    setModalData({
      title,
      message,
      isConfirm: false,
      confirmText: '확인',
    });
    setIsOpen(true);
  }, []);

  const showConfirm = useCallback((options: ModalOptions) => {
    setModalData({
      title: options.title || '확인',
      message: options.message,
      onConfirm: options.onConfirm,
      confirmText: options.confirmText || '확인',
      cancelText: options.cancelText || '취소',
      isConfirm: true,
    });
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (modalData.onConfirm) {
      modalData.onConfirm();
    }
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Modal isOpen={isOpen} onClose={handleClose} title={modalData.title || '알림'} maxWidth="max-w-sm">
        <div className="space-y-4">
          <p className="text-[12px] text-slate-300 whitespace-pre-line leading-relaxed">
            {modalData.message}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            {modalData.isConfirm && (
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {modalData.cancelText || '취소'}
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
            >
              {modalData.confirmText || '확인'}
            </button>
          </div>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useAppModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useAppModal must be used within a ModalProvider');
  }
  return context;
};
