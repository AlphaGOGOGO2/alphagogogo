
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDropdownOptions {
  closeDelay?: number;
  openOnHover?: boolean;
  closeOnClick?: boolean;
}

export function useDropdown({
  closeDelay = 300,
  openOnHover = true,
  closeOnClick = true
}: UseDropdownOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  }, [closeDelay, clearCloseTimeout]);

  const handleMouseEnter = useCallback(() => {
    if (!openOnHover) return;
    clearCloseTimeout();
    setIsOpen(true);
  }, [openOnHover, clearCloseTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (!openOnHover) return;
    scheduleClose();
  }, [openOnHover, scheduleClose]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleItemClick = useCallback(() => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  }, [closeOnClick]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  return {
    isOpen,
    dropdownRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onItemClick: handleItemClick,
      onClose: handleClose
    }
  };
}
